# SurgeryPreview - Quick Deploy Guide

## 🚀 Deploy in 30 Minutes

---

## Step 1: Domain & Hosting (5 minutes)

### Buy Domain
- Go to Namecheap or GoDaddy
- Buy: `surgerypreview.co` or similar ($12/year)

### Deploy Frontend (FREE)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd /path/to/project
vercel --prod

# Connect your domain in Vercel dashboard
```

**Alternative:** Netlify (drag & drop the HTML file)

---

## Step 2: Setup Airtable Database (10 minutes)

### Create Airtable Base
1. Go to airtable.com (sign up free)
2. Create new base: "SurgeryPreview"
3. Create tables:

#### Table 1: Leads
```
Fields:
- Name (Single line text)
- Email (Email)
- Phone (Phone number)
- Procedure (Single select): Rhinoplasty, Breast Aug, Facelift, Lipo, BBL, Chin, Other
- Location (Single select): NYC-Manhattan, NYC-Brooklyn, NYC-Queens, Long Island, NJ
- Timeline (Single select): 1-3 months, 3-6 months, 6-12 months, Just researching
- Notes (Long text)
- Status (Single select): New, Contacted, Booked, Lost
- CreatedAt (Date)
```

#### Table 2: Surgeons
```
Fields:
- Name (Single line text)
- Email (Email)
- Phone (Phone number)
- Specialties (Multiple select): Rhinoplasty, Breast Aug, Facelift, etc.
- Location (Single select): NYC-Manhattan, NYC-Brooklyn, etc.
- PriceRange (Single line text): "$8,000 - $12,000"
- RealSelfRating (Number): 0-5
- ReviewCount (Number)
- Website (URL)
- Status (Single select): Active, Inactive, Pending
- CommissionRate (Currency): $75.00
```

#### Table 3: LeadDistribution
```
Fields:
- Lead (Link to Leads)
- Surgeon (Link to Surgeons)
- SentAt (Date)
- Status (Single select): Sent, Opened, Contacted, Booked
```

#### Table 4: Bookings
```
Fields:
- Lead (Link to Leads)
- Surgeon (Link to Surgeons)
- BookingDate (Date)
- CommissionOwed (Currency)
- CommissionPaid (Checkbox)
- Notes (Long text)
```

### Get Airtable API Key
1. Go to airtable.com/account
2. Click "Generate API key"
3. Copy your API key
4. Get your Base ID from API docs

---

## Step 3: Setup SendGrid Email (5 minutes)

1. Go to sendgrid.com (sign up - FREE 100 emails/day)
2. Create API key:
   - Settings → API Keys → Create API Key
   - Full Access
   - Copy the key
3. Verify sender email:
   - Settings → Sender Authentication
   - Verify "team@surgerypreview.co"

---

## Step 4: Deploy Backend API (10 minutes)

### Option A: Vercel (Recommended for MVP)

```bash
# Install dependencies
npm init -y
npm install express cors airtable @sendgrid/mail

# Create vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "backend-api.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "backend-api.js"
    }
  ]
}

# Set environment variables in Vercel dashboard:
AIRTABLE_API_KEY=your_key
AIRTABLE_BASE_ID=your_base_id
SENDGRID_API_KEY=your_sendgrid_key

# Deploy
vercel --prod
```

### Option B: Railway.app (Alternative)
- Connect GitHub repo
- Add environment variables
- Deploy automatically

---

## Step 5: Connect Frontend to Backend

Update the HTML file:

```javascript
// In surgery-preview-mvp.html, update the submitForm function:

async function submitForm(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    
    // Show loading state
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Processing...';
    submitBtn.disabled = true;
    
    try {
        // Send to your API
        const response = await fetch('https://your-api.vercel.app/api/leads', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            alert('🎉 Success! Check your email for surgeon matches.');
            closeModal();
            event.target.reset();
        } else {
            throw new Error('Failed to submit');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('❌ Something went wrong. Please try again or email us directly.');
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}
```

---

## Step 6: Add Surgeons to Database

Manually add 10-15 NYC surgeons to Airtable:

### How to Find Surgeons:
1. Go to RealSelf.com
2. Search "Plastic Surgeon NYC"
3. Filter by 4.5+ stars, 100+ reviews
4. Manually add to Airtable:
   - Name: Dr. John Smith
   - Email: contact@drjohnsmith.com (from their website)
   - Phone: (212) 555-1234
   - Specialties: Rhinoplasty, Facelift
   - Location: NYC-Manhattan
   - PriceRange: $8,000 - $15,000
   - RealSelfRating: 4.8
   - ReviewCount: 247
   - Website: https://drjohnsmith.com
   - Status: Active

**Target Surgeons:**
- Dr. Michael Broumand (Manhattan)
- Dr. Douglas Steinbrech (Manhattan)
- Dr. Elie Levine (NYC)
- Dr. Cangello (Manhattan)
- Dr. Jeremy Nikfarjam (Long Island)
- etc.

---

## Step 7: Test End-to-End (5 minutes)

1. Go to your live website
2. Fill out form with test data
3. Check Airtable - lead should appear
4. Check email - you should receive:
   - Lead notification to surgeons
   - Confirmation to patient

---

## Step 8: Launch Marketing

### Google Ads Campaign ($500 test)
```
Campaign: Plastic Surgery NYC
Budget: $500/month ($16/day)
Target: NYC, 25-55 years old

Keywords (Match: Exact):
- [rhinoplasty nyc] - CPC: $5-8
- [breast augmentation manhattan] - CPC: $6-10
- [plastic surgeon near me] - CPC: $3-5
- [best plastic surgeon nyc] - CPC: $4-7

Landing Page: surgerypreview.co
Ad Copy:
"See Your Results Before Surgery | Free Surgeon Match"
"Upload photo, get matched with NYC's top surgeons. Free quotes."
```

### Instagram Ads ($300 test)
```
Audience: NYC, 25-45, interests: beauty, cosmetics, fashion
Creative: Before/after examples (stock photos with disclaimer)
Budget: $300/month
Goal: 30+ leads
```

---

## Environment Variables Template

Create `.env` file:

```bash
# Airtable
AIRTABLE_API_KEY=keyXXXXXXXXXXXXXX
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX

# SendGrid
SENDGRID_API_KEY=SG.XXXXXXXXXXXXXXXX

# Optional: Analytics
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
MIXPANEL_TOKEN=xxxxxxxxxxxxxxxx

# Stripe (for future paid features)
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
```

---

## Quick Deploy Checklist

- [ ] Domain purchased ($12/year)
- [ ] HTML deployed to Vercel/Netlify
- [ ] Airtable base created with 4 tables
- [ ] SendGrid account setup + verified sender
- [ ] Backend API deployed
- [ ] Environment variables configured
- [ ] 10+ surgeons added to Airtable
- [ ] Test form submission end-to-end
- [ ] Google Analytics added
- [ ] Privacy Policy page created
- [ ] Terms of Service page created

---

## Cost Breakdown (Monthly)

```
Domain: $1/month (paid annually)
Vercel: $0 (free tier)
Airtable: $0 (free tier: 1,200 records)
SendGrid: $0 (free tier: 100 emails/day)
Backend hosting: $0 (Vercel/Railway free tier)
-----------------
Total Infrastructure: $1/month

Marketing:
Google Ads: $500/month (optional)
Instagram Ads: $300/month (optional)
-----------------
Total: $1-801/month
```

---

## Scaling Triggers

### When to upgrade:
- **1,200+ leads:** Upgrade Airtable to Plus ($20/mo) for 50K records
- **100+ emails/day:** Upgrade SendGrid to Essentials ($20/mo) for 50K emails
- **Need automation:** Add Zapier Pro ($20/mo)

### When to build custom backend:
- **5,000+ leads/month:** Move from Airtable to Postgres/Supabase
- **$10K+ MRR:** Hire dev to build custom CRM
- **AI features:** Integrate OpenAI API (~$0.02-0.05 per image analysis)

---

## Support & Monitoring

### Must-have monitoring:
1. **Uptime monitoring:** UptimeRobot (free)
2. **Error tracking:** Sentry (free tier)
3. **Analytics:** Google Analytics 4 (free)
4. **Form submissions:** Check Airtable daily

### Weekly KPIs to track:
- Leads captured
- Surgeon response rate
- Consultation booking rate
- Cost per lead
- Revenue per booking

---

## Pro Tips

1. **Test with personal email first** before sending to surgeons
2. **Response time matters:** Surgeons who respond within 1 hour book 5x more
3. **Follow up:** If surgeon doesn't respond in 24h, send reminder
4. **A/B test landing page:** Try different headlines
5. **Track everything:** Which procedure converts best? Which location?

---

## Need Help?

Common issues:
- **CORS errors:** Add `Access-Control-Allow-Origin: *` header
- **Email not sending:** Check SendGrid sender verification
- **Airtable API errors:** Verify API key and base ID
- **Form not submitting:** Check browser console for errors

---

You're ready to launch! 🚀

Deploy today, get first lead tomorrow, book first consultation this week.
