# Sales-Pal Backend API

Production-ready Express.js backend for Sales-Pal, deployed to Google Cloud Run with Cloud SQL (PostgreSQL).

## Prerequisites

- **Node.js** v20+ ([download](https://nodejs.org))
- **Docker** ([download](https://docs.docker.com/get-docker/))
- **Google Cloud CLI** (`gcloud`) ([install](https://cloud.google.com/sdk/docs/install))
- **PostgreSQL 15+** (local development) or **Cloud SQL** instance (production)

---

## Local Development Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and fill in your local PostgreSQL credentials and JWT secrets:

```env
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_local_password
DB_NAME=salespal
JWT_ACCESS_SECRET=dev_access_secret_min_32_chars_long
JWT_REFRESH_SECRET=dev_refresh_secret_min_32_chars_long
```

### 3. Create the Database

```bash
createdb salespal
```

### 4. Run Migrations

```bash
npm run migrate
```

### 5. Start the Dev Server

```bash
npm run dev
```

Server starts at `http://localhost:8080`. The `--watch` flag auto-restarts on file changes.

---

## Running Migrations Against Cloud SQL

### Via Cloud SQL Proxy (recommended)

```bash
# Install the proxy
gcloud components install cloud-sql-proxy

# Start proxy (connects to Cloud SQL via IAM)
cloud-sql-proxy YOUR_PROJECT:us-central1:salespal-db --port=5433

# In another terminal, run migrations
DB_HOST=127.0.0.1 DB_PORT=5433 DB_USER=salespal DB_PASSWORD=xxx DB_NAME=salespal node src/db/migrate.js
```

### Via Direct IP (if allowlisted)

```bash
DB_HOST=<CLOUD_SQL_IP> DB_PORT=5432 DB_USER=salespal DB_PASSWORD=xxx DB_NAME=salespal node src/db/migrate.js
```

---

## Docker Build & Push

### Build the Image

```bash
docker build -t salespal-backend .
```

### Test Locally

```bash
docker run --env-file .env -p 8080:8080 salespal-backend
```

### Push to Google Artifact Registry

```bash
# Configure Docker auth
gcloud auth configure-docker us-central1-docker.pkg.dev

# Tag
docker tag salespal-backend us-central1-docker.pkg.dev/YOUR_PROJECT/salespal/backend:latest

# Push
docker push us-central1-docker.pkg.dev/YOUR_PROJECT/salespal/backend:latest
```

---

## Deploy to Cloud Run

```bash
gcloud run deploy salespal-backend \
  --image us-central1-docker.pkg.dev/YOUR_PROJECT/salespal/backend:latest \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --add-cloudsql-instances YOUR_PROJECT:us-central1:salespal-db \
  --set-env-vars "NODE_ENV=production" \
  --set-env-vars "DB_USER=salespal" \
  --set-env-vars "DB_PASSWORD=xxx" \
  --set-env-vars "DB_NAME=salespal" \
  --set-env-vars "CLOUD_SQL_CONNECTION_NAME=YOUR_PROJECT:us-central1:salespal-db" \
  --set-env-vars "DB_SSL=false" \
  --set-env-vars "JWT_ACCESS_SECRET=xxx" \
  --set-env-vars "JWT_REFRESH_SECRET=xxx" \
  --set-env-vars "CORS_ORIGINS=https://your-app.vercel.app" \
  --set-env-vars "AI_API_KEY=xxx" \
  --set-env-vars "META_APP_ID=xxx" \
  --set-env-vars "META_APP_SECRET=xxx" \
  --min-instances 0 \
  --max-instances 10 \
  --memory 512Mi \
  --cpu 1 \
  --port 8080
```

> **Note:** In production, Cloud Run connects to Cloud SQL via Unix socket. Set `CLOUD_SQL_CONNECTION_NAME` and the backend will auto-configure the socket path.

---

## Environment Variables

| Variable                    | Required | Description                                          |
| --------------------------- | -------- | ---------------------------------------------------- |
| `PORT`                      | No       | Server port (default: 8080, Cloud Run injects this)  |
| `NODE_ENV`                  | No       | `development` or `production` (default: development) |
| `DB_HOST`                   | Yes      | PostgreSQL host                                      |
| `DB_PORT`                   | Yes      | PostgreSQL port (default: 5432)                      |
| `DB_USER`                   | Yes      | PostgreSQL user                                      |
| `DB_PASSWORD`               | Yes      | PostgreSQL password                                  |
| `DB_NAME`                   | Yes      | PostgreSQL database name                             |
| `DB_SSL`                    | No       | Enable SSL (default: false)                          |
| `DB_POOL_MAX`               | No       | Max pool connections (default: 20)                   |
| `CLOUD_SQL_CONNECTION_NAME` | Prod     | Cloud SQL instance `project:region:instance`         |
| `JWT_ACCESS_SECRET`         | Yes      | Secret for access tokens (min 32 chars)              |
| `JWT_REFRESH_SECRET`        | Yes      | Secret for refresh tokens (must differ from access)  |
| `JWT_ACCESS_TTL`            | No       | Access token TTL in seconds (default: 900)           |
| `JWT_REFRESH_TTL`           | No       | Refresh token TTL in seconds (default: 604800)       |
| `BCRYPT_SALT_ROUNDS`        | No       | Bcrypt salt rounds (default: 12)                     |
| `CORS_ORIGINS`              | No       | Comma-separated allowed origins                      |
| `AI_API_URL`                | No       | AI API endpoint (default: OpenAI)                    |
| `AI_API_KEY`                | No       | AI API key                                           |
| `AI_MODEL`                  | No       | AI model name (default: gpt-4o-mini)                 |
| `META_APP_ID`               | No       | Facebook/Meta App ID                                 |
| `META_APP_SECRET`           | No       | Facebook/Meta App Secret                             |
| `RATE_LIMIT_WINDOW_MS`      | No       | Rate limit window (default: 900000)                  |
| `RATE_LIMIT_MAX`            | No       | Max requests per window (default: 100)               |
| `LOG_LEVEL`                 | No       | Winston log level (default: info)                    |

---

## API Endpoint Reference

### Authentication (Public)

| Method | Path             | Auth     | Description               |
| ------ | ---------------- | -------- | ------------------------- |
| POST   | `/auth/register` | No       | Register a new user       |
| POST   | `/auth/login`    | No       | Login with email/password |
| POST   | `/auth/refresh`  | No       | Refresh access token      |
| POST   | `/auth/logout`   | Optional | Logout and revoke tokens  |

### Users

| Method | Path         | Auth | Description                 |
| ------ | ------------ | ---- | --------------------------- |
| GET    | `/users/me`  | Yes  | Get current user profile    |
| PUT    | `/users/me`  | Yes  | Update current user profile |
| GET    | `/users/:id` | Yes  | Get user by ID (admin)      |

### Sales (Deals)

| Method | Path         | Auth | Description             |
| ------ | ------------ | ---- | ----------------------- |
| GET    | `/sales`     | Yes  | List deals (filterable) |
| GET    | `/sales/:id` | Yes  | Get deal by ID          |
| POST   | `/sales`     | Yes  | Create a deal           |
| PUT    | `/sales/:id` | Yes  | Update a deal           |
| DELETE | `/sales/:id` | Yes  | Delete a deal           |

### Contacts

| Method | Path            | Auth | Description                |
| ------ | --------------- | ---- | -------------------------- |
| GET    | `/contacts`     | Yes  | List contacts (searchable) |
| GET    | `/contacts/:id` | Yes  | Get contact by ID          |
| POST   | `/contacts`     | Yes  | Create a contact           |
| PUT    | `/contacts/:id` | Yes  | Update a contact           |
| DELETE | `/contacts/:id` | Yes  | Delete a contact           |

### Marketing

| Method | Path                           | Auth | Description                |
| ------ | ------------------------------ | ---- | -------------------------- |
| GET    | `/marketing/campaigns`         | Yes  | List campaigns             |
| GET    | `/marketing/campaigns/:id`     | Yes  | Get campaign by ID         |
| POST   | `/marketing/campaigns`         | Yes  | Create a campaign          |
| PUT    | `/marketing/campaigns/:id`     | Yes  | Update a campaign          |
| DELETE | `/marketing/campaigns/:id`     | Yes  | Delete a campaign          |
| GET    | `/marketing/drafts`            | Yes  | List campaign drafts       |
| POST   | `/marketing/drafts`            | Yes  | Create a draft             |
| PUT    | `/marketing/drafts/:id`        | Yes  | Update a draft             |
| POST   | `/marketing/drafts/:id/launch` | Yes  | Launch a draft as campaign |
| DELETE | `/marketing/drafts/:id`        | Yes  | Delete a draft             |

### Social

| Method | Path                                        | Auth | Description           |
| ------ | ------------------------------------------- | ---- | --------------------- |
| GET    | `/social/posts`                             | Yes  | List social posts     |
| GET    | `/social/posts/:id`                         | Yes  | Get post by ID        |
| POST   | `/social/posts`                             | Yes  | Create a post         |
| PUT    | `/social/posts/:id`                         | Yes  | Update a post         |
| DELETE | `/social/posts/:id`                         | Yes  | Delete a post         |
| GET    | `/social/integrations`                      | Yes  | List integrations     |
| POST   | `/social/integrations/connect`              | Yes  | Connect a platform    |
| POST   | `/social/integrations/disconnect/:platform` | Yes  | Disconnect a platform |

### Support

| Method | Path                    | Auth | Description              |
| ------ | ----------------------- | ---- | ------------------------ |
| GET    | `/support`              | Yes  | List tickets             |
| GET    | `/support/:id`          | Yes  | Get ticket with comments |
| POST   | `/support`              | Yes  | Create a ticket          |
| PUT    | `/support/:id`          | Yes  | Update a ticket          |
| POST   | `/support/:id/comments` | Yes  | Add a comment            |
| DELETE | `/support/:id`          | Yes  | Delete a ticket          |

### Analytics

| Method | Path                                   | Auth | Description                   |
| ------ | -------------------------------------- | ---- | ----------------------------- |
| GET    | `/analytics/dashboard?period=30d`      | Yes  | Full dashboard aggregate      |
| GET    | `/analytics/revenue?period=30d`        | Yes  | Revenue summary               |
| GET    | `/analytics/leads?period=30d`          | Yes  | Lead metrics                  |
| GET    | `/analytics/leads/timeline?period=30d` | Yes  | Leads over time               |
| GET    | `/analytics/platforms?period=30d`      | Yes  | Platform breakdown            |
| GET    | `/analytics/daily?period=30d`          | Yes  | Daily metrics timeseries      |
| GET    | `/analytics/comparison?period=30d`     | Yes  | Period-over-period comparison |

### Billing

| Method | Path                                          | Auth | Description                |
| ------ | --------------------------------------------- | ---- | -------------------------- |
| GET    | `/billing/plans`                              | Yes  | Get available plans        |
| GET    | `/billing/subscriptions`                      | Yes  | Get user subscriptions     |
| POST   | `/billing/subscriptions/activate`             | Yes  | Activate a subscription    |
| POST   | `/billing/subscriptions/:moduleId/deactivate` | Yes  | Cancel a subscription      |
| POST   | `/billing/subscriptions/:moduleId/pause`      | Yes  | Pause a subscription       |
| POST   | `/billing/subscriptions/:moduleId/resume`     | Yes  | Resume a subscription      |
| GET    | `/billing/credits`                            | Yes  | Get credit balance         |
| POST   | `/billing/credits/consume`                    | Yes  | Consume credits            |
| POST   | `/billing/credits/add`                        | Yes  | Add credits                |
| GET    | `/billing/credits/transactions`               | Yes  | Credit transaction history |

### Projects

| Method | Path                    | Auth | Description       |
| ------ | ----------------------- | ---- | ----------------- |
| GET    | `/projects`             | Yes  | List projects     |
| GET    | `/projects/:id`         | Yes  | Get project by ID |
| POST   | `/projects`             | Yes  | Create a project  |
| PUT    | `/projects/:id`         | Yes  | Update a project  |
| POST   | `/projects/:id/archive` | Yes  | Archive a project |
| DELETE | `/projects/:id`         | Yes  | Delete a project  |

### AI

| Method | Path                                | Auth | Description                  |
| ------ | ----------------------------------- | ---- | ---------------------------- |
| POST   | `/ai/chat`                          | Yes  | General AI chat              |
| GET    | `/ai/campaigns/:campaignId/analyze` | Yes  | Analyze campaign performance |
| GET    | `/ai/insights?period=30d`           | Yes  | Strategic marketing insights |
| POST   | `/ai/ad-copy`                       | Yes  | Generate ad copy             |

### System

| Method | Path      | Auth | Description  |
| ------ | --------- | ---- | ------------ |
| GET    | `/health` | No   | Health check |
