# SurgeryPreview - AI Plastic Surgery Product

## 🚀 Overview

SurgeryPreview is an AI-powered plastic surgery referral platform that connects patients with top board-certified plastic surgeons. The platform uses a two-phase approach:

1. **Phase 1 (MVP)**: Surgeon referral model - match patients with surgeons, charge surgeons $50-150 per booked consultation
2. **Phase 2 (AI)**: Add OpenAI Vision API integration for surgical outcome simulations

## 📊 Business Model

### Revenue Streams
- **Surgeon Referral Fees**: $50-150 per booked consultation
- **AI Simulation Fees**: $3-5 per image analysis (future)
- **Subscription Tier**: $19.99/month for unlimited simulations (future)

### Target Metrics (Month 1-3)
- 10-15 surgeons recruited
- 30-50 leads captured
- 10-20 consultations booked
- $500-3,000 revenue

## 🏗️ Project Structure

```
surgerypreview-ai/
├── frontend/              # Landing page (HTML/CSS/JS)
├── backend/              # Node.js API server
├── database/             # Airtable schema & scripts
├── scripts/              # Automation & utility scripts
├── marketing/            # Outreach templates & campaigns
├── legal/               # Legal documents & compliance
└── docs/                # Documentation & guides
```

## 🚀 Quick Start

### 1. Deploy Frontend (5 minutes)
```bash
# Deploy to Vercel (free)
npm i -g vercel
cd frontend
vercel --prod
```

### 2. Setup Airtable Database (10 minutes)
1. Create Airtable account (free tier)
2. Create base with 4 tables: Leads, Surgeons, LeadDistribution, Bookings
3. Get API key and Base ID

### 3. Setup SendGrid Email (5 minutes)
1. Create SendGrid account (free: 100 emails/day)
2. Verify sender email
3. Get API key

### 4. Deploy Backend (10 minutes)
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your API keys
vercel --prod
```

### 5. Connect Frontend to Backend
Update the API endpoint in `frontend/surgery-preview-mvp.html` to point to your deployed backend.

## 📋 MVP Features

### Phase 1 (Week 1-4)
- ✅ Landing page with lead capture form
- ✅ Airtable database for leads & surgeons
- ✅ Automated email notifications
- ✅ Surgeon matching algorithm
- ✅ Basic analytics dashboard

### Phase 2 (Month 2-3)
- 🔄 OpenAI Vision API integration
- 🔄 AI-powered surgical outcome simulations
- 🔄 Patient photo analysis
- 🔄 Enhanced matching algorithm
- 🔄 Payment processing (Stripe)

## 🛠️ Tech Stack

### MVP Stack (No Code Required)
- **Frontend**: HTML/CSS/JS (Vercel/Netlify)
- **Database**: Airtable (free tier: 1,200 records)
- **Email**: SendGrid (free: 100 emails/day)
- **Backend**: Node.js/Express (Vercel/Railway)
- **Analytics**: Google Analytics 4

### Future Stack (With Funding)
- **Frontend**: React/Next.js
- **Backend**: Node.js/Express with PostgreSQL
- **AI**: OpenAI GPT-4 Vision API
- **Payments**: Stripe Connect
- **Hosting**: AWS/Azure/GCP

## 📈 Success Metrics

### Week 1 Goals
- ✅ Deploy landing page
- ✅ Setup Airtable database
- ✅ Email 20 surgeons
- ✅ Get first 3 leads
- ✅ Manual lead distribution

### Month 1 Goals
- ✅ 10+ surgeons recruited
- ✅ 30+ leads captured
- ✅ 5+ consultations booked
- ✅ $250+ revenue
- ✅ Positive unit economics

## 🔒 Legal & Compliance

### Required Documents
1. **Medical Disclaimers** (on every page)
2. **Privacy Policy** (GDPR/CCPA compliant)
3. **Terms of Service**
4. **HIPAA Compliance** (for photo storage)
5. **Business Structure** (LLC recommended)

### Key Considerations
- Don't store photos long-term without consent
- Add clear medical disclaimers
- Form an LLC for liability protection
- Consult with healthcare attorney

## 📚 Documentation

- [MVP Implementation Guide](docs/MVP_IMPLEMENTATION_GUIDE.md) - Complete step-by-step guide
- [Deployment Guide](docs/DEPLOY_GUIDE.md) - Technical deployment instructions
- [Surgeon Outreach Kit](marketing/SURGEON_OUTREACH_KIT.md) - Email templates & scripts

## 💰 Cost Breakdown

### Monthly Infrastructure (MVP)
- Domain: $1/month
- Vercel: $0 (free tier)
- Airtable: $0 (free tier)
- SendGrid: $0 (free tier)
- **Total: $1/month**

### Marketing Budget (Optional)
- Google Ads: $500/month
- Instagram/Facebook: $300/month
- **Total: $0-800/month**

## 🎯 Next Steps

1. **Today**: Deploy landing page, setup Airtable
2. **Tomorrow**: Email 20 surgeons, setup SendGrid
3. **This Week**: Get first lead, manual distribution
4. **Next Week**: Run $200 ad test, track conversions

## 🤝 Contributing

This is a solo founder project initially. Future contributions welcome after funding.

## 📄 License

MIT License - see LICENSE file for details

## 📞 Contact

For questions or support:
- Email: yoshi@surgerypreview.co
- Website: surgerypreview.co (coming soon)

---

**Launch in 48 hours. Iterate weekly based on data.**