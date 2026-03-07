const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const db = require('../config/db');
const env = require('../config/env');

/**
 * Hash a plaintext password using bcrypt.
 */
async function hashPassword(plaintext) {
  return bcrypt.hash(plaintext, env.bcryptSaltRounds);
}

/**
 * Compare a plaintext password against a bcrypt hash.
 */
async function comparePassword(plaintext, hash) {
  return bcrypt.compare(plaintext, hash);
}

/**
 * Generate an access token (short-lived).
 */
function generateAccessToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
    },
    env.jwt.accessSecret,
    { expiresIn: env.jwt.accessTTL }
  );
}

/**
 * Generate a refresh token (long-lived) and persist its hash in the database.
 * @returns {{ token: string, expiresAt: Date }}
 */
async function generateRefreshToken(userId) {
  const token = crypto.randomBytes(64).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const expiresAt = new Date(Date.now() + env.jwt.refreshTTL * 1000);

  await db.query(
    `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
     VALUES ($1, $2, $3)`,
    [userId, tokenHash, expiresAt]
  );

  return { token, expiresAt };
}

/**
 * Validate a refresh token against the database.
 * Returns the token row if valid, null otherwise.
 */
async function validateRefreshToken(token) {
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  const { rows } = await db.query(
    `SELECT id, user_id, expires_at, revoked FROM refresh_tokens
     WHERE token_hash = $1`,
    [tokenHash]
  );

  const row = rows[0];
  if (!row) return null;
  if (row.revoked) return null;
  if (new Date(row.expires_at) < new Date()) return null;

  return row;
}

/**
 * Revoke a specific refresh token.
 */
async function revokeRefreshToken(token) {
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  await db.query(
    `UPDATE refresh_tokens SET revoked = TRUE WHERE token_hash = $1`,
    [tokenHash]
  );
}

/**
 * Revoke all refresh tokens for a user (logout all sessions).
 */
async function revokeAllRefreshTokens(userId) {
  await db.query(
    `UPDATE refresh_tokens SET revoked = TRUE WHERE user_id = $1 AND revoked = FALSE`,
    [userId]
  );
}

/**
 * Clean up expired refresh tokens (run periodically).
 */
async function cleanupExpiredTokens() {
  await db.query(
    `DELETE FROM refresh_tokens WHERE expires_at < NOW() OR revoked = TRUE`
  );
}

/**
 * Register a new user.
 * Creates the user, a default organization, and org membership.
 * Returns { user, accessToken, refreshToken }.
 */
async function registerUser({ email, password, fullName }) {
  const client = await db.getClient();

  try {
    await client.query('BEGIN');

    // Check if email is already taken
    const existing = await client.query(
      `SELECT id FROM users WHERE email = $1`,
      [email]
    );
    if (existing.rows.length > 0) {
      const err = new Error('Email is already registered');
      err.statusCode = 409;
      err.code = 'CONFLICT';
      throw err;
    }

    // Create user
    const passwordHash = await hashPassword(password);
    const userResult = await client.query(
      `INSERT INTO users (email, password_hash, full_name)
       VALUES ($1, $2, $3) RETURNING id, email, full_name, role, created_at`,
      [email, passwordHash, fullName || null]
    );
    const user = userResult.rows[0];

    // Create default organization
    const orgResult = await client.query(
      `INSERT INTO organizations (name, slug)
       VALUES ($1, $2) RETURNING id`,
      [`${fullName || email}'s Workspace`, email.split('@')[0]]
    );
    const org = orgResult.rows[0];

    // Create org membership
    await client.query(
      `INSERT INTO org_members (user_id, org_id, role)
       VALUES ($1, $2, 'owner')`,
      [user.id, org.id]
    );

    await client.query('COMMIT');

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user.id);

    return {
      user: { ...user, org_id: org.id },
      accessToken,
      refreshToken: refreshToken.token,
    };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Authenticate a user with email + password.
 * Returns { user, accessToken, refreshToken }.
 */
async function loginUser({ email, password }) {
  const { rows } = await db.query(
    `SELECT u.*, om.org_id
     FROM users u
     LEFT JOIN org_members om ON u.id = om.user_id
     WHERE u.email = $1
     LIMIT 1`,
    [email]
  );

  const user = rows[0];
  if (!user) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    err.code = 'UNAUTHORIZED';
    throw err;
  }

  const passwordValid = await comparePassword(password, user.password_hash);
  if (!passwordValid) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    err.code = 'UNAUTHORIZED';
    throw err;
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = await generateRefreshToken(user.id);

  // Strip sensitive fields
  const { password_hash, ...safeUser } = user;

  return {
    user: safeUser,
    accessToken,
    refreshToken: refreshToken.token,
  };
}

/**
 * Refresh an access token using a valid refresh token.
 * Implements refresh token rotation: old token is revoked, new one issued.
 */
async function refreshAccessToken(refreshTokenValue) {
  const tokenRow = await validateRefreshToken(refreshTokenValue);

  if (!tokenRow) {
    const err = new Error('Invalid or expired refresh token');
    err.statusCode = 401;
    err.code = 'UNAUTHORIZED';
    throw err;
  }

  // Revoke old refresh token (rotation)
  await revokeRefreshToken(refreshTokenValue);

  // Fetch user
  const { rows } = await db.query(
    `SELECT id, email, role FROM users WHERE id = $1`,
    [tokenRow.user_id]
  );
  const user = rows[0];
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 401;
    err.code = 'UNAUTHORIZED';
    throw err;
  }

  const accessToken = generateAccessToken(user);
  const newRefreshToken = await generateRefreshToken(user.id);

  return {
    accessToken,
    refreshToken: newRefreshToken.token,
  };
}

module.exports = {
  hashPassword,
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  validateRefreshToken,
  revokeRefreshToken,
  revokeAllRefreshTokens,
  cleanupExpiredTokens,
  registerUser,
  loginUser,
  refreshAccessToken,
};
