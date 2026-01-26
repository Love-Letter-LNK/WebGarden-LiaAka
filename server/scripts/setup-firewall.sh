#!/bin/bash

echo "Configuring UFW Firewall..."

# Default policies
ufw default deny incoming
ufw default allow outgoing

# Allow SSH (Change 22 to your custom port if configured)
ufw allow 22/tcp

# Allow HTTP & HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# Nginx Full (Alternative if Nginx is installed)
# ufw allow 'Nginx Full'

# Enable Firewall
echo "Enabling firewall..."
ufw enable

echo "Firewall status:"
ufw status verbose
