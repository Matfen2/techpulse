<div align="center">

# 🔶 TechPulse

**Marketplace & Catalogue High-Tech avec vérification vidéo**

[![CI](https://github.com/mathieufenouil/techpulse/actions/workflows/ci.yml/badge.svg)](https://github.com/mathieufenouil/techpulse/actions)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)](https://hub.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

*Plateforme e-commerce complète pour produits tech neufs et d'occasion, avec un système unique de vérification vidéo des annonces par les administrateurs.*

[Démo Live](https://techpulse.example.com) · [Documentation](docs/) · [Signaler un bug](https://github.com/mathieufenouil/techpulse/issues)

</div>

---

## 📋 Table des matières

- [Fonctionnalités](#-fonctionnalités)
- [Stack technique](#-stack-technique)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Déploiement AWS](#-déploiement-aws)
- [API Endpoints](#-api-endpoints)
- [Structure du projet](#-structure-du-projet)
- [Auteur](#-auteur)

---

## ✨ Fonctionnalités

### Catalogue (B2C)
- Navigation par catégories (Smartphones, Laptops, Wearables, Accessoires)
- Filtres avancés par marque, prix, note, disponibilité
- Fiches produits détaillées avec spécifications techniques
- Système d'avis et notes avec modération

### Marketplace (C2C)
- Dépôt d'annonces avec upload photos + vidéo obligatoire
- **Vérification vidéo par les administrateurs** avant publication
- Workflow de modération complet (pending → active / rejected)
- Système de vente sécurisé

### Utilisateurs
- Authentification JWT (inscription, connexion, sessions)
- Dashboard personnel (annonces, achats, favoris)
- Panier d'achat avec checkout (mode démo)
- Gestion des favoris en temps réel

### Administration
- Dashboard avec KPIs, graphiques (Recharts) et alertes
- CRUD complet des produits du catalogue
- Modération des annonces avec checklist de vérification
- Gestion des utilisateurs

### Technique
- Design system dark theme avec variables CSS
- Responsive design (mobile-first)
- Animations fluides (Framer Motion)
- Skeleton loaders et optimistic UI
- CI/CD GitHub Actions (lint, security audit, tests, build, Docker)
- Dockerisé (dev + prod multi-stage)

---

## 🛠 Stack technique

| Couche | Technologies |
|--------|-------------|
| **Frontend** | React 18, Vite, Tailwind CSS 4, Framer Motion, Recharts |
| **Backend** | Node.js 20, Express, JWT, Multer, Cloudinary |
| **Base de données** | MongoDB 7, Mongoose ODM |
| **DevOps** | Docker, Docker Compose, GitHub Actions, Nginx |
| **Cloud** | AWS EC2, MongoDB Atlas (optionnel) |

---

## 🏗 Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │     │   Server    │     │  MongoDB    │
│  React/Vite │────▶│  Express    │────▶│  Mongoose   │
│   (Nginx)   │     │  REST API   │     │             │
│   Port 80   │     │  Port 5000  │     │  Port 27017 │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │
       │              ┌────┴────┐
       │              │ Uploads │
       │              │ Multer  │
       │              │Cloudinary│
       └──────────────┴─────────┘
```

### Modèles de données

- **User** - Authentification, rôles (user/admin), profil vendeur
- **Product** - Catalogue (admin), specs JSON, notes agrégées
- **Listing** - Annonces marketplace, images[], vidéo, workflow statut
- **Review** - Avis utilisateurs, note 1-5, lié à Product + User
- **Order** - Commandes, items, montants, statut
- **Favorite** - Favoris utilisateur sur produits catalogue

---

## 🚀 Installation

### Prérequis

- [Node.js 20+](https://nodejs.org/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Git](https://git-scm.com/)

### Développement (Docker)

```bash
# Cloner le repo
git clone https://github.com/mathieufenouil/techpulse.git
cd techpulse

# Lancer les 3 services (MongoDB + Express + React)
docker compose up --build

# Seeder la base de données (dans un autre terminal)
docker exec techpulse-server node seeds/seed.js
```

Accès :
- Frontend : http://localhost:5173
- API : http://localhost:5000/api/health
- MongoDB : localhost:27017

### Développement (sans Docker)

```bash
# Server
cd server
npm install
npm run dev

# Client (autre terminal)
cd client
npm install
npm run dev
```

Variables d'environnement (`.env` dans `/server`) :
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/techpulse
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Production (Docker)

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

---

## ☁️ Déploiement AWS

### EC2 + Docker Compose

```bash
# 1. Connecter à l'instance EC2
ssh -i key.pem ubuntu@<EC2_PUBLIC_IP>

# 2. Installer Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker ubuntu

# 3. Cloner et déployer
git clone https://github.com/mathieufenouil/techpulse.git
cd techpulse
echo "JWT_SECRET=your_production_secret" > .env
docker compose -f docker-compose.prod.yml up -d --build

# 4. Vérifier
docker ps
curl http://localhost/api/health
```

Ouvrir les ports dans le Security Group AWS : `80` (HTTP), `443` (HTTPS), `22` (SSH).

---

## 📡 API Endpoints

### Auth
| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/api/auth/signup` | Inscription |
| POST | `/api/auth/login` | Connexion |
| GET | `/api/auth/me` | Profil connecté |

### Products (Catalogue)
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/products` | Liste (filtres, pagination, tri) |
| GET | `/api/products/:slug` | Détail par slug |
| GET | `/api/brands` | Liste des marques |
| POST | `/api/products` | Créer (admin) |
| PUT | `/api/products/:id` | Modifier (admin) |
| DELETE | `/api/products/:id` | Supprimer (admin) |

### Listings (Marketplace)
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/listings` | Annonces actives |
| GET | `/api/listings/:slug` | Détail annonce |
| POST | `/api/listings` | Créer (auth + upload) |
| GET | `/api/listings/my` | Mes annonces |
| PUT | `/api/listings/:id/verify` | Modérer (admin) |

### Reviews, Favorites, Orders, Admin
| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/api/reviews` | Ajouter un avis |
| GET/POST/DELETE | `/api/favorites` | Gérer favoris |
| POST | `/api/orders` | Créer commande |
| GET | `/api/admin/stats` | Dashboard admin |

---

## 📁 Structure du projet

```
techpulse/
├── client/                  # Frontend React
│   ├── src/
│   │   ├── components/      # ProductCard, Navbar, Rating...
│   │   ├── context/         # Auth, Cart, Favorites
│   │   ├── pages/           # 16 pages (Home, Catalogue, Marketplace...)
│   │   ├── services/        # Axios API calls
│   │   └── App.jsx          # Routes
│   └── public/images/       # Logos marques
├── server/                  # Backend Express
│   ├── controllers/         # Logique métier
│   ├── models/              # Schemas Mongoose (6 modèles)
│   ├── routes/              # Endpoints API
│   ├── middleware/           # Auth JWT, upload Multer
│   ├── seeds/               # Script de seeding
│   └── server.js            # Entry point
├── docker/                  # Dockerfiles (dev + prod)
│   ├── Dockerfile.client
│   ├── Dockerfile.client.prod
│   ├── Dockerfile.server
│   ├── Dockerfile.server.prod
│   └── nginx.conf
├── .github/workflows/       # CI/CD pipeline
│   └── ci.yml
├── docker-compose.yml       # Dev
├── docker-compose.prod.yml  # Production
└── README.md
```

---

## 🧑‍💻 Auteur

**Mathieu Fenouil** - Full-Stack Developer

- LinkedIn : [linkedin.com/in/mathieu-fenouil](https://linkedin.com/in/mathieu-fenouil)
- GitHub : [github.com/mathieufenouil](https://github.com/mathieufenouil)

---

## 📄 License

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.
