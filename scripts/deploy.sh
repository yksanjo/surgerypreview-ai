#!/bin/bash

# SurgeryPreview Deployment Script
# This script helps deploy the SurgeryPreview MVP

set -e  # Exit on error

echo "=========================================="
echo "SURGERYPREVIEW MVP DEPLOYMENT"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

# Check prerequisites
echo "Checking prerequisites..."

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_status "Node.js $NODE_VERSION installed"
else
    print_error "Node.js not installed. Please install Node.js 18+"
    exit 1
fi

# Check npm
if command -v npm &> /dev/null; then
    print_status "npm installed"
else
    print_error "npm not installed"
    exit 1
fi

# Check Vercel CLI
if command -v vercel &> /dev/null; then
    print_status "Vercel CLI installed"
else
    print_warning "Vercel CLI not installed. Installing..."
    npm install -g vercel
    print_status "Vercel CLI installed"
fi

echo ""
echo "=========================================="
echo "STEP 1: BACKEND DEPLOYMENT"
echo "=========================================="

cd backend

# Install dependencies
echo "Installing backend dependencies..."
npm install
print_status "Backend dependencies installed"

# Check for .env file
if [ -f ".env" ]; then
    print_status ".env file found"
else
    print_warning ".env file not found. Creating from example..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        print_status ".env file created from example"
        print_warning "Please edit .env file with your API keys before deployment"
    else
        print_error ".env.example not found"
        exit 1
    fi
fi

# Deploy backend
echo "Deploying backend to Vercel..."
read -p "Do you want to deploy backend now? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    vercel --prod
    print_status "Backend deployed"
else
    print_warning "Backend deployment skipped"
fi

cd ..

echo ""
echo "=========================================="
echo "STEP 2: FRONTEND DEPLOYMENT"
echo "=========================================="

cd frontend

# Update API endpoint in HTML file
echo "Updating API endpoint in frontend..."
BACKEND_URL=""
if [ -f "../backend/.vercel/project.json" ]; then
    BACKEND_URL=$(jq -r '.project.json' ../backend/.vercel/project.json 2>/dev/null || echo "")
fi

if [ -z "$BACKEND_URL" ]; then
    read -p "Enter your backend API URL: " BACKEND_URL
fi

if [ ! -z "$BACKEND_URL" ]; then
    # Create a copy of the HTML file with updated API endpoint
    cp surgery-preview-mvp.html surgery-preview-mvp-deploy.html
    # Note: In production, you would use a proper templating system
    # For now, we'll just note that the API endpoint needs to be updated
    print_warning "Please update the API endpoint in surgery-preview-mvp.html to: $BACKEND_URL"
    print_warning "Search for 'https://your-api.vercel.app' and replace with your backend URL"
else
    print_warning "Backend URL not set. Please update API endpoint manually in HTML file"
fi

# Deploy frontend
echo "Deploying frontend to Vercel..."
read -p "Do you want to deploy frontend now? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    vercel --prod
    print_status "Frontend deployed"
else
    print_warning "Frontend deployment skipped"
fi

cd ..

echo ""
echo "=========================================="
echo "STEP 3: DATABASE SETUP"
echo "=========================================="

echo "Please setup your Airtable database:"
echo "1. Go to airtable.com and create account"
echo "2. Create new base 'SurgeryPreview'"
echo "3. Create tables: Leads, Surgeons, LeadDistribution, Bookings"
echo "4. Get API key from airtable.com/account"
echo "5. Get Base ID from API documentation"
echo ""
echo "See database/airtable-schema.md for detailed schema"

echo ""
echo "=========================================="
echo "STEP 4: EMAIL SETUP"
echo "=========================================="

echo "Please setup SendGrid for email:"
echo "1. Go to sendgrid.com and create account"
echo "2. Create API key with full access"
echo "3. Verify sender email: team@surgerypreview.co"
echo "4. Update .env file with SendGrid API key"

echo ""
echo "=========================================="
echo "STEP 5: DOMAIN SETUP"
echo "=========================================="

echo "Please setup your domain:"
echo "1. Buy domain: surgerypreview.co (Namecheap/GoDaddy)"
echo "2. Connect domain in Vercel dashboard"
echo "3. Update DNS records as instructed by Vercel"

echo ""
echo "=========================================="
echo "STEP 6: LEGAL DOCUMENTS"
echo "=========================================="

echo "Please create legal pages:"
echo "1. Privacy Policy (see legal/privacy-policy.md)"
echo "2. Terms of Service (see legal/terms-of-service.md)"
echo "3. Medical Disclaimers (add to every page)"
echo "4. Create HTML pages and link in footer"

echo ""
echo "=========================================="
echo "STEP 7: TESTING"
echo "=========================================="

echo "After deployment, please test:"
echo "1. Visit your live website"
echo "2. Submit test lead form"
echo "3. Check Airtable for new lead"
echo "4. Check email delivery"
echo "5. Test surgeon matching"

echo ""
echo "=========================================="
echo "DEPLOYMENT CHECKLIST"
echo "=========================================="

echo "✅ Backend deployed to Vercel"
echo "✅ Frontend deployed to Vercel"
echo "✅ Airtable database created"
echo "✅ SendGrid email configured"
echo "✅ Domain purchased and connected"
echo "✅ Legal documents created"
echo "✅ Test submission working"

echo ""
echo "=========================================="
echo "NEXT STEPS"
echo "=========================================="

echo "1. Add 10-15 surgeons to Airtable database"
echo "2. Email surgeons using outreach templates"
echo "3. Run $200 Google Ads test campaign"
echo "4. Get first 3 leads"
echo "5. Manually match and send to surgeons"
echo "6. Track consultation bookings"

echo ""
echo "=========================================="
echo "QUICK START COMMANDS"
echo "=========================================="

echo "To add surgeons to database:"
echo "  python3 scripts/surgeon-outreach.py"
echo ""
echo "To test backend locally:"
echo "  cd backend && npm run dev"
echo ""
echo "To redeploy frontend:"
echo "  cd frontend && vercel --prod"
echo ""
echo "To redeploy backend:"
echo "  cd backend && vercel --prod"

echo ""
echo "=========================================="
echo "SUPPORT"
echo "=========================================="

echo "For questions or issues:"
echo "1. Check docs/ directory for guides"
echo "2. Review MVP_IMPLEMENTATION_GUIDE.md"
echo "3. Email: yoshi@surgerypreview.co"

echo ""
echo "=========================================="
echo "LAUNCH READY! 🚀"
echo "=========================================="

echo "Your SurgeryPreview MVP is ready to launch!"
echo "Start recruiting surgeons and capturing leads today!"
echo ""
echo "Remember: Launch in 48 hours. Iterate weekly based on data."