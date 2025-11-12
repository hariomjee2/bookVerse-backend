# Running BookVerse Backend with Docker

## Prerequisites

- Docker and Docker Compose installed
- `.env` file with `JWT_SECRET` set

## Quick Start

### 1. Create .env file

```bash
JWT_SECRET=your_secret_key
```

### 2. Build and start
Start services:
```bash
docker-compose up -d
```
Stop services:
```bash
docker-compose down
```
View logs:
docker-compose logs -f bookverse-app
View MongoDB logs:
docker-compose logs -f bookverse-mongodb

Rebuild image after code changes:

```bash
docker-compose up -d --build
```
