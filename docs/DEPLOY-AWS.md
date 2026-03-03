# ☁️ Guide de déploiement AWS EC2 — TechPulse

## 1. Créer l'instance EC2

### Console AWS → EC2 → Launch Instance

- **AMI** : Ubuntu Server 24.04 LTS (Free Tier eligible)
- **Type** : `t2.micro` (Free Tier) ou `t3.small` (recommandé pour prod)
- **Stockage** : 20 Go gp3 minimum
- **Security Group** :
  - SSH (22) → Mon IP
  - HTTP (80) → 0.0.0.0/0
  - HTTPS (443) → 0.0.0.0/0
- **Key pair** : Créer ou sélectionner une paire de clés `.pem`

## 2. Se connecter à l'instance

```bash
# Rendre la clé privée lisible uniquement par vous
chmod 400 techpulse-key.pem

# Connexion SSH
ssh -i techpulse-key.pem ubuntu@<EC2_PUBLIC_IP>
```

## 3. Installer Docker & Docker Compose

```bash
# Mise à jour système
sudo apt update && sudo apt upgrade -y

# Installer Docker
curl -fsSL https://get.docker.com | sh

# Ajouter l'utilisateur au groupe docker
sudo usermod -aG docker ubuntu

# Se reconnecter pour appliquer les groupes
exit
ssh -i techpulse-key.pem ubuntu@<EC2_PUBLIC_IP>

# Vérifier
docker --version
docker compose version
```

## 4. Cloner et configurer

```bash
# Cloner le repo
git clone https://github.com/mathieufenouil/techpulse.git
cd techpulse

# Créer le fichier .env
cp .env.example .env
nano .env
# → Modifier JWT_SECRET avec une vraie clé
# → Ajouter les clés Cloudinary
```

## 5. Déployer

```bash
# Build et lancer en background
docker compose -f docker-compose.prod.yml up -d --build

# Vérifier que tout tourne
docker ps

# Vérifier les logs
docker logs techpulse-server-prod
docker logs techpulse-client-prod

# Test rapide
curl http://localhost/api/health
# → {"status":"ok"}
```

## 6. Seeder la base de données

```bash
docker exec techpulse-server-prod node seeds/seed.js
```

## 7. Accéder à l'application

- **URL** : `http://<EC2_PUBLIC_IP>`
- **API** : `http://<EC2_PUBLIC_IP>/api/health`

## 8. (Optionnel) Nom de domaine + HTTPS

### Elastic IP
```bash
# Console AWS → EC2 → Elastic IPs → Allocate → Associate à l'instance
# → IP fixe qui ne change pas au reboot
```

### Domaine
- Acheter un domaine (Namecheap, OVH, Route53...)
- Pointer le A record vers l'Elastic IP

### HTTPS avec Certbot
```bash
# Installer Certbot
sudo apt install certbot -y

# Obtenir le certificat (arrêter nginx temporairement)
docker compose -f docker-compose.prod.yml stop client
sudo certbot certonly --standalone -d techpulse.example.com

# Copier les certs dans le projet et mettre à jour nginx.conf
# Puis relancer
docker compose -f docker-compose.prod.yml up -d
```

## 9. Commandes utiles

```bash
# Voir les logs en temps réel
docker compose -f docker-compose.prod.yml logs -f

# Redémarrer un service
docker compose -f docker-compose.prod.yml restart server

# Mise à jour du code
git pull
docker compose -f docker-compose.prod.yml up -d --build

# Voir l'utilisation mémoire/CPU
docker stats

# Backup MongoDB
docker exec techpulse-mongo-prod mongodump --out /data/backup
docker cp techpulse-mongo-prod:/data/backup ./backup-$(date +%Y%m%d)
```

## 10. Checklist pré-production

- [ ] `JWT_SECRET` changé (pas la valeur par défaut)
- [ ] Clés Cloudinary configurées
- [ ] Security Group : ports 80/443 ouverts, 27017 fermé
- [ ] Elastic IP associée
- [ ] Seed exécuté
- [ ] `curl /api/health` retourne OK
- [ ] Frontend accessible sur le port 80
- [ ] Upload d'images/vidéos fonctionnel