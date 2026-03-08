const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const pool = require('../config/db'); // Changed db to pool
const env = require('../config/env'); // Kept env for bcryptSaltRounds and jwt secrets
const logger = require('../config/logger'); // Kept logger path as is, assuming it's correct

// New imports for Google OAuth
const { OAuth2Client } = require('google-auth-library');

// Initialize Google OAuth2Client
const googleClient = new OAuth2Client(env.google.clientId); // Using env for GOOGLE_CLIENT_ID

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

  await pool.query( // Changed db.query to pool.query
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

  const { rows } = await pool.query( // Changed db.query to pool.query
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
  await pool.query( // Changed db.query to pool.query
    `UPDATE refresh_tokens SET revoked = TRUE WHERE token_hash = $1`,
    [tokenHash]
  );
}

/**
 * Revoke all refresh tokens for a user (logout all sessions).
 */
async function revokeAllRefreshTokens(userId) {
  await pool.query( // Changed db.query to pool.query
    `UPDATE refresh_tokens SET revoked = TRUE WHERE user_id = $1 AND revoked = FALSE`,
    [userId]
  );
}

/**
 * Clean up expired refresh tokens (run periodically).
 */
async function cleanupExpiredTokens() {
  await pool.query( // Changed db.query to pool.query
    `DELETE FROM refresh_tokens WHERE expires_at < NOW() OR revoked = TRUE`
  );
}

/**
 * Register a new user.
 * Creates the user, a default organization, and org membership.
 * Returns { user, accessToken, refreshToken }.
 */
async function registerUser({ email, password, fullName }) {
  const client = await pool.getClient(); // Changed db.getClient() to pool.getClient()

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

    // Generate Verification Token
    const verificationToken = jwt.sign(
      { email, purpose: 'verify_email' },
      env.jwt.accessSecret,
      { expiresIn: '1d' }
    );
    
    // Simulate sending email
    const verificationLink = `http://localhost:8080/auth/verify?token=${verificationToken}`;
    logger.info(`[EMAIL SIMULATION] Verification Email sent to ${email}`);
    logger.info(`[EMAIL SIMULATION] Please click: ${verificationLink}`);

    return {
      message: 'Registration successful. Please check your email to verify your account.',
      requiresEmailVerification: true
    };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Verify an email token and mark the user as verified.
 */
async function verifyEmailToken(token) {
  try {
    const decoded = jwt.verify(token, env.jwt.accessSecret);
    if (decoded.purpose !== 'verify_email' || !decoded.email) {
      throw new Error('Invalid token purpose');
    }

    const { rowCount } = await pool.query( // Changed db.query to pool.query
      `UPDATE users SET email_verified = TRUE WHERE email = $1 AND email_verified = FALSE`,
      [decoded.email]
    );

    return rowCount > 0;
  } catch (err) {
    const wrap = new Error('Invalid or expired verification link');
    wrap.statusCode = 400;
    wrap.code = 'INVALID_TOKEN';
    throw wrap;
  }
}

/**
 * Authenticate a user with email + password.
 * Returns { user, accessToken, refreshToken }.
 */
async function loginUser({ email, password }) {
  const { rows } = await pool.query( // Changed db.query to pool.query
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

  if (!user.email_verified) {
    const err = new Error('Please verify your email before logging in. Check your inbox.');
    err.statusCode = 403;
    err.code = 'EMAIL_NOT_VERIFIED';
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
  const { rows } = await pool.query( // Changed db.query to pool.query
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

/**
 * Authenticate or register a user via Google OAuth.
 */
const googleLogin = async (token) => {
    try {
        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: env.google.clientId, // Using env for GOOGLE_CLIENT_ID
        });
        
        const payload = ticket.getPayload();
        if (!payload) {
            throw new Error('Invalid Google token');
        }

        const { email, name, picture } = payload;
        
        // Check if user exists
        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        let user;

        if (userResult.rows.length === 0) {
            // Create new user (no password for OAuth users, or a random complex string)
            const randomPassword = crypto.randomBytes(32).toString('hex');
            const passwordHash = await bcrypt.hash(randomPassword, env.bcryptSaltRounds); // Using env for salt rounds
            
            const insertResult = await pool.query(
                'INSERT INTO users (email, password_hash, full_name, avatar_url, email_verified) VALUES ($1, $2, $3, $4, true) RETURNING id, email, full_name, role, created_at, avatar_url, email_verified', // Added returning fields
                [email, passwordHash, name, picture]
            );
            user = insertResult.rows[0];
            logger.info(`New user registered via Google: ${email}`);

            // Create default organization for new Google user
            const orgResult = await pool.query(
              `INSERT INTO organizations (name, slug)
               VALUES ($1, $2) RETURNING id`,
              [`${name || email}'s Workspace`, email.split('@')[0]]
            );
            const org = orgResult.rows[0];

            // Create org membership
            await pool.query(
              `INSERT INTO org_members (user_id, org_id, role)
               VALUES ($1, $2, 'owner')`,
              [user.id, org.id]
            );

        } else {
            user = userResult.rows[0];
            
            // If user exists but is not verified, mark them as verified since they proved they own the email via Google
            if (!user.email_verified) {
                await pool.query('UPDATE users SET email_verified = true WHERE id = $1', [user.id]);
                user.email_verified = true;
            }
            // Optionally update avatar/name if you want to sync them
            if (picture && user.avatar_url !== picture) {
                 await pool.query('UPDATE users SET avatar_url = $1 WHERE id = $2', [picture, user.id]);
                 user.avatar_url = picture;
            }
        }

        // Generate tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = await generateRefreshToken(user.id); // Await generateRefreshToken

        // Strip sensitive fields
        delete user.password_hash;
        return { user, accessToken, refreshToken: refreshToken.token }; // Return refreshToken.token

    } catch (error) {
        logger.error(`Google login failed: ${error.message}`);
        const err = new Error('Failed to authenticate with Google');
        err.statusCode = 401;
        err.code = 'UNAUTHORIZED';
        throw err;
    }
};

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
  verifyEmailToken,
  loginUser,
  refreshAccessToken,
  googleLogin,
};
