# Running BookVerse Backend with Docker

## Prerequisites

- Docker and Docker Compose installed
- `.env` file with `JWT_SECRET` set

## Quick Start

### 1. Create .env file

```bash
JWT_SECRET=your_secret_key
```

### 2. Build and start (without docker-compose)

Build the image:

```bash
docker build -t bookverse-app:latest .
```

Start the app using an env file (no docker-compose):

```bash
# ensure .env is in the project root
docker run --env-file .env -p 3000:3000 --name bookverse-app bookverse-app:latest
```

Stop and remove the container:

```bash
docker stop bookverse-app && docker rm bookverse-app
```

View logs:

```bash
docker logs -f bookverse-app
```

Rebuild image after code changes:

```bash
docker build -t bookverse-app:latest .
docker run --env-file .env -p 3000:3000 --name bookverse-app bookverse-app:latest
```

Notes about `.env` values and `#` characters:

- If any value in your `.env` contains a `#` (for example inside a password or URI), it may be treated as a comment when parsed by some tools.
- Two safe options:
  1. URL-encode `#` as `%23` inside the connection string (recommended for URIs):
     `mongodb+srv://user:pass%23withHash@host/...`
  2. Or wrap the whole value in double quotes in the `.env` file:
     `MONGO_URI="mongodb+srv://user:pass#withHash@host/..."`

- Do not commit `.env` to version control. Keep secrets secure.
