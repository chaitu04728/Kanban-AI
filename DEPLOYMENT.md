# Kanban AI - Docker & Deployment Guide

## 🐳 Docker Setup

This project includes Docker configuration for easy deployment.

### Files Overview

- `Dockerfile` - Multi-stage build for optimized Next.js container
- `docker-compose.yml` - Orchestrates app and MongoDB containers
- `.dockerignore` - Excludes unnecessary files from Docker build
- `.github/workflows/deploy.yml` - CI/CD pipeline for automated deployment
- `scripts/setup-server.sh` - Server setup script

## 🚀 Local Development with Docker

```bash
# Build and start containers
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down

# Rebuild after code changes
docker-compose up -d --build
```

Access the application at `http://localhost:3000`

## 📦 Environment Variables

Create a `.env` file in the project root:

```env
# MongoDB Configuration
MONGO_USERNAME=admin
MONGO_PASSWORD=changeme123
MONGODB_URI=mongodb://admin:changeme123@mongodb:27017/kanban?authSource=admin

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-change-this

# OpenAI Configuration (Optional)
OPENAI_API_KEY=your-openai-api-key-here
```

## 🖥️ Production Deployment

### 1. Server Setup

Run the setup script on your server (Ubuntu/Debian):

```bash
# Download and run setup script
curl -o setup.sh https://raw.githubusercontent.com/chaitu04728/Kanban-AI/main/scripts/setup-server.sh
chmod +x setup.sh
./setup.sh
```

This script will:

- Install Docker and Docker Compose
- Clone the repository to `/opt/kanban-ai`
- Create systemd service for auto-start
- Setup firewall rules
- Configure log rotation

### 2. Configure Environment

Edit the environment file on your server:

```bash
nano /opt/kanban-ai/.env
```

Update with your production values:

- Change `MONGO_PASSWORD` to a strong password
- Generate a secure `NEXTAUTH_SECRET`: `openssl rand -base64 32`
- Set your production `NEXTAUTH_URL`
- Add your `OPENAI_API_KEY` if using AI features

### 3. Start Application

```bash
cd /opt/kanban-ai
docker-compose up -d
```

Or use the helper script:

```bash
/opt/kanban-ai/deploy.sh
```

## 🔄 GitHub Actions CI/CD

### Setup GitHub Secrets

Go to your GitHub repository → Settings → Secrets and add:

| Secret Name       | Description                                          |
| ----------------- | ---------------------------------------------------- |
| `SERVER_HOST`     | Your server IP or domain                             |
| `SERVER_USER`     | SSH username                                         |
| `SSH_PRIVATE_KEY` | SSH private key for authentication                   |
| `SERVER_PORT`     | SSH port (default: 22)                               |
| `MONGODB_URI`     | MongoDB connection string                            |
| `NEXTAUTH_URL`    | Production URL (e.g., https://kanban.yourdomain.com) |
| `NEXTAUTH_SECRET` | Secure random string                                 |
| `OPENAI_API_KEY`  | OpenAI API key (optional)                            |
| `MONGO_USERNAME`  | MongoDB username                                     |
| `MONGO_PASSWORD`  | MongoDB password                                     |

### Automated Deployment

The CI/CD pipeline automatically:

1. Builds Docker image on push to `main` branch
2. Pushes image to GitHub Container Registry
3. SSHs into your server
4. Pulls latest image
5. Restarts containers with zero downtime
6. Verifies deployment

### Manual Deployment Trigger

You can also manually trigger deployment from GitHub Actions tab.

## 📊 Container Management

### View Running Containers

```bash
docker-compose ps
```

### View Logs

```bash
# All containers
docker-compose logs -f

# Specific service
docker-compose logs -f app
docker-compose logs -f mongodb
```

### Restart Services

```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart app
```

### Database Backup

```bash
# Backup MongoDB
docker exec kanban-mongodb mongodump --out /data/backup

# Restore MongoDB
docker exec kanban-mongodb mongorestore /data/backup
```

## 🔧 Troubleshooting

### Application not starting

```bash
# Check logs
docker-compose logs app

# Check if MongoDB is healthy
docker-compose ps mongodb
```

### MongoDB connection issues

```bash
# Test MongoDB connection
docker exec -it kanban-mongodb mongosh -u admin -p changeme123
```

### Disk space issues

```bash
# Clean up unused images and containers
docker system prune -a

# Remove old images
docker image prune -a
```

## 🛡️ Security Best Practices

1. **Change default passwords** in `.env`
2. **Use strong NEXTAUTH_SECRET** (32+ characters)
3. **Enable firewall** on your server
4. **Use HTTPS** with reverse proxy (Nginx/Caddy)
5. **Regular backups** of MongoDB data
6. **Keep Docker images updated**

## 🌐 Reverse Proxy Setup (Optional)

### Using Nginx

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Using Caddy (Automatic HTTPS)

```
yourdomain.com {
    reverse_proxy localhost:3000
}
```

## 📈 Monitoring

### Health Checks

```bash
# Application health
curl http://localhost:3000

# MongoDB health
docker exec kanban-mongodb mongosh --eval "db.adminCommand('ping')"
```

### Resource Usage

```bash
# Container stats
docker stats

# Disk usage
docker system df
```

## 🆘 Support

For issues or questions:

- GitHub Issues: https://github.com/chaitu04728/Kanban-AI/issues
- Check logs: `docker-compose logs -f`
