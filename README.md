# HostMeUp &nbsp; [![Live](https://img.shields.io/badge/Live-Demo-brightgreen?style=flat&logo=vercel)](https://cloud.srb.codes)

Self-hosted file storage service with GitHub OAuth, per-user storage limits, and AWS S3 for object storage. A lightweight Google Drive alternative you can run on your own EC2 instance.

## Features

- GitHub OAuth authentication
- File upload via pre-signed S3 URLs
- File listing and delete
- Per-user storage limits (1 GB default)
- PostgreSQL for metadata storage (Drizzle ORM)
- Request logging
- Dockerized — runs on any EC2 or VPS

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js, Express.js |
| Database | PostgreSQL (Drizzle ORM) |
| Storage | AWS S3 (pre-signed URLs) |
| Auth | GitHub OAuth + JWT |
| Frontend | React, Vite |
| Deployment | Docker, docker-compose |

## System Design

![System Design](docs/system_design.png)

## Quick Start

### Prerequisites

- Docker and docker-compose
- AWS S3 bucket with IAM credentials
- PostgreSQL database (managed or self-hosted)
- GitHub OAuth App (for authentication)

### Setup

1. Copy and configure the environment file:

   ```bash
   cp .env.example .env
   ```

   Required variables:

   ```env
   AWS_ACCESS_KEY_ID=
   AWS_SECRET_ACCESS_KEY=
   AWS_S3_REGION=
   AWS_S3_BUCKET_NAME=

   DATABASE_URL=postgresql://user:password@host:5432/hostmeup

   JWT_SECRET=
   GITHUB_CLIENT_ID=
   GITHUB_CLIENT_SECRET=
   ```

2. Run database migrations:

   ```bash
   npx drizzle-kit push
   ```

3. Start the application:

   ```bash
   docker-compose up --build
   ```

4. Open `http://localhost:3000` and sign in with GitHub.

## S3 Bucket Configuration

See [`docs/s3config.md`](docs/s3config.md) for the required bucket policy and CORS configuration.

## Author

Built by [Sourabh Soni](https://srb.codes?utm_source=github&utm_medium=readme&utm_campaign=google-drive-clone) — Full-Stack & Gen AI Engineer.

## Connect

Let's connect on X [@srbcode](https://x.com/srbcode)

## License

MIT
