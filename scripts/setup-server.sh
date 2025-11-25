#!/bin/bash

# Kanban AI - Server Setup and Deployment Script
# This script sets up the server environment and deploys the application

set -e

echo "🚀 Starting Kanban AI deployment setup..."

# Configuration
APP_DIR="/opt/kanban-ai"
REPO_URL="https://github.com/chaitu04728/Kanban-AI.git"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored messages
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Check if running as root
if [ "$EUID" -eq 0 ]; then 
    print_error "Please do not run as root. Run as a regular user with sudo privileges."
    exit 1
fi

# Update system packages
print_info "Updating system packages..."
sudo apt-get update
sudo apt-get upgrade -y
print_success "System packages updated"

# Install Docker
if ! command -v docker &> /dev/null; then
    print_info "Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
    print_success "Docker installed"
else
    print_success "Docker already installed"
fi

# Install Docker Compose
if ! command -v docker-compose &> /dev/null; then
    print_info "Installing Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    print_success "Docker Compose installed"
else
    print_success "Docker Compose already installed"
fi

# Install Git
if ! command -v git &> /dev/null; then
    print_info "Installing Git..."
    sudo apt-get install -y git
    print_success "Git installed"
else
    print_success "Git already installed"
fi

# Create application directory
print_info "Setting up application directory..."
sudo mkdir -p $APP_DIR
sudo chown $USER:$USER $APP_DIR
print_success "Application directory created"

# Clone repository
if [ -d "$APP_DIR/.git" ]; then
    print_info "Repository already exists, pulling latest changes..."
    cd $APP_DIR
    git pull origin main
else
    print_info "Cloning repository..."
    git clone $REPO_URL $APP_DIR
    cd $APP_DIR
fi
print_success "Repository ready"

# Create .env file
print_info "Setting up environment variables..."
if [ ! -f "$APP_DIR/.env" ]; then
    cat > $APP_DIR/.env << 'EOF'
# MongoDB Configuration
MONGO_USERNAME=admin
MONGO_PASSWORD=changeme123
MONGODB_URI=mongodb://admin:changeme123@mongodb:27017/kanban?authSource=admin

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-change-this-in-production

# OpenAI Configuration (Optional)
OPENAI_API_KEY=your-openai-api-key-here
EOF
    print_success "Environment file created (Please update with your values)"
    print_error "⚠️  IMPORTANT: Edit $APP_DIR/.env with your actual credentials!"
else
    print_success "Environment file already exists"
fi

# Setup firewall (if UFW is available)
if command -v ufw &> /dev/null; then
    print_info "Configuring firewall..."
    sudo ufw allow 22/tcp
    sudo ufw allow 3000/tcp
    sudo ufw allow 80/tcp
    sudo ufw allow 443/tcp
    print_success "Firewall configured"
fi

# Create systemd service for auto-start
print_info "Creating systemd service..."
sudo tee /etc/systemd/system/kanban-ai.service > /dev/null << EOF
[Unit]
Description=Kanban AI Docker Compose Application
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=$APP_DIR
ExecStart=/usr/local/bin/docker-compose up -d
ExecStop=/usr/local/bin/docker-compose down
User=$USER

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable kanban-ai.service
print_success "Systemd service created"

# Create deployment helper script
cat > $APP_DIR/deploy.sh << 'DEPLOY_SCRIPT'
#!/bin/bash
set -e

echo "🔄 Deploying Kanban AI..."

cd /opt/kanban-ai

# Pull latest code
git pull origin main

# Pull latest images
docker-compose pull

# Restart containers
docker-compose down
docker-compose up -d

# Clean up
docker image prune -af

echo "✅ Deployment complete!"
docker-compose ps
DEPLOY_SCRIPT

chmod +x $APP_DIR/deploy.sh
print_success "Deployment helper script created"

# Setup log rotation
print_info "Setting up log rotation..."
sudo tee /etc/logrotate.d/kanban-ai > /dev/null << EOF
/var/lib/docker/containers/*/*.log {
    rotate 7
    daily
    compress
    missingok
    delaycompress
    copytruncate
}
EOF
print_success "Log rotation configured"

echo ""
print_success "=== Setup Complete! ==="
echo ""
print_info "Next steps:"
echo "1. Edit environment file: nano $APP_DIR/.env"
echo "2. Update NEXTAUTH_SECRET, MONGO_PASSWORD, and other secrets"
echo "3. Start the application: cd $APP_DIR && docker-compose up -d"
echo "4. Or use the helper script: $APP_DIR/deploy.sh"
echo ""
print_info "GitHub Actions will automatically deploy on push to main branch"
print_info "Make sure to configure these secrets in GitHub:"
echo "  - SERVER_HOST"
echo "  - SERVER_USER"
echo "  - SSH_PRIVATE_KEY"
echo "  - MONGODB_URI"
echo "  - NEXTAUTH_URL"
echo "  - NEXTAUTH_SECRET"
echo "  - OPENAI_API_KEY"
echo "  - MONGO_USERNAME"
echo "  - MONGO_PASSWORD"
echo ""
print_success "Happy coding! 🎉"
