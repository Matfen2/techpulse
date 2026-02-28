# 🔶 TechPulse

[![CI/CD](https://github.com/Matfen2/techpulse/actions/workflows/ci.yml/badge.svg)](https://github.com/Matfen2/techpulse/actions/workflows/ci.yml)

**TechPulse** is a full-stack e-commerce marketplace for high-tech products — smartphones, laptops, wearables — built with React, Express, and MongoDB, fully containerized with Docker and automated with GitHub Actions CI/CD.

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Tailwind CSS 4, React Router, Framer Motion |
| Backend | Node.js 20, Express, Mongoose, JWT |
| Database | MongoDB 7 |
| Testing | Vitest, Supertest (57 tests) |
| Containerization | Docker, Docker Compose, Nginx |
| CI/CD | GitHub Actions (lint → test → build → Docker → security) |

## 📂 Project Structure

```
techpulse/
├── client/                  # React + Vite frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Route pages
│   │   ├── context/         # React Context (auth, cart)
│   │   └── services/        # API service layer
│   └── ...
├── server/                  # Express API
│   ├── controllers/         # Route handlers
│   ├── models/              # Mongoose schemas
│   ├── routes/              # API routes
│   ├── middleware/           # Auth, validation, error handling
│   ├── config/              # Database config
│   ├── seeds/               # Sample data
│   ├── tests/               # API integration tests
│   └── server.js
├── docker/                  # Docker configuration
│   ├── Dockerfile.server    # Multi-stage (dev + prod)
│   ├── Dockerfile.client    # Multi-stage (dev + Nginx prod)
│   └── nginx.conf           # Production reverse proxy
├── .github/workflows/       # CI/CD pipeline
├── docker-compose.yml       # Development environment
├── docker-compose.prod.yml  # Production override
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- [Node.js 20+](https://nodejs.org/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Git](https://git-scm.com/)

### Development (Docker)

```bash
git clone https://github.com/Matfen2/techpulse.git
cd techpulse
docker compose up --build
```

| Service  | URL                          |
|----------|------------------------------|
| Frontend | http://localhost:5173         |
| API      | http://localhost:5000/api     |
| MongoDB  | mongodb://localhost:27017     |

### Development (Local)

```bash
# Server
cd server
cp .env.example .env
npm install
npm run dev

# Client (new terminal)
cd client
cp .env.example .env
npm install
npm run dev
```

### Production

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d
```

Frontend served via Nginx on port 80 with API reverse proxy.

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/login` | Login & get JWT token |
| GET | `/api/auth/me` | Get current user profile |
| PUT | `/api/auth/me` | Update user profile |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List all products (filters, search, pagination) |
| GET | `/api/products/:id` | Get product details |
| POST | `/api/products` | Create product (admin) |
| PUT | `/api/products/:id` | Update product (admin) |
| DELETE | `/api/products/:id` | Delete product (admin) |

### Reviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products/:id/reviews` | Get product reviews |
| POST | `/api/products/:id/reviews` | Add a review (auth) |

### Listings (Marketplace)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/listings` | List all seller listings |
| POST | `/api/listings` | Create a listing (auth) |
| PUT | `/api/listings/:id` | Update listing (owner/admin) |
| DELETE | `/api/listings/:id` | Delete listing (owner/admin) |

## 🧪 Testing

```bash
cd server
npm test
```

57 integration tests covering auth, products, reviews, and listings APIs using Vitest + Supertest with MongoDB Memory Server.

## 🔄 CI/CD Pipeline

The GitHub Actions pipeline runs on every push to `main`/`develop`:

```
🔍 Lint  →  🧪 Tests (MongoDB)  →  🏗️ Build  →  🐳 Docker  →  🛡️ Security
```

- **Lint**: ESLint on server and client code
- **Tests**: API integration tests with MongoDB service container
- **Build**: Vite production build with artifact upload
- **Docker**: Multi-stage production image builds
- **Security**: npm audit on both packages

## 🐳 Docker Architecture

Multi-stage builds for optimized images:

- **Server**: `node:20-alpine` → non-root user, healthcheck, production-only deps
- **Client**: `node:20-alpine` build → `nginx:alpine` serving static files with gzip + caching
- **MongoDB**: Official `mongo:7` with health checks and persistent volumes

## 👤 Author

**Mathieu Fenouil** — Full-Stack Developer

- GitHub: [@Matfen2](https://github.com/Matfen2)
- LinkedIn: [Mathieu Fenouil](https://www.linkedin.com/in/mathieu-fenouil/)