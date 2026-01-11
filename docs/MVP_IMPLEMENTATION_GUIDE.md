# SurgeryPreview MVP - Implementation Guide

## 🎯 PHASE 1: SURGEON REFERRAL MODEL (Launch in 7 days)

**Goal:** Prove demand, get paid by surgeons $50-150 per booked consultation, THEN build AI with funding.

---

## Revenue Model

### Surgeon Pricing (Your Revenue)
- **Per Qualified Lead Sent:** $0 (you pay for lead gen)
- **Per Booked Consultation:** $50-150 (surgeon pays you when they book the patient)
- **Target:** 10 consultations/week = $2,000-6,000/month revenue
- **At scale:** 50 consultations/week = $10K-30K/month

### Lead Flow
1. Patient fills form → You capture lead (cost: $5-20 per lead via ads)
2. You match patient with 3 surgeons instantly via email
3. Surgeons compete to book the patient
4. When surgeon books consultation → You get paid $50-150
5. Net profit per lead: $30-130

---

## Tech Stack (MVP - No Code Required)

### Option 1: Launch in 48 Hours (Recommended)
```
✅ Landing Page: Netlify/Vercel (FREE)
✅ Lead Capture: FormSubmit.co (FREE) or Formspree ($19/mo)
✅ Database: Airtable (FREE tier: 1,200 records)
✅ Email: SendGrid (FREE: 100 emails/day)
✅ Analytics: Google Analytics 4 (FREE)
✅ Surgeon Dashboard: Airtable shared view (FREE)

Total Monthly Cost: $0-19
```

### Option 2: Slightly More Robust
```
✅ Landing Page: Vercel (FREE)
✅ Backend: Supabase (FREE tier: 500MB database)
✅ Email: SendGrid (FREE)
✅ Payment (later): Stripe ($0 + 2.9% per transaction)
✅ CRM: Airtable or Notion (FREE)

Total Monthly Cost: $0
```

---

## Implementation Steps

### Week 1: Setup (Days 1-2)
1. ✅ Deploy HTML landing page to Netlify (10 minutes)
2. ✅ Setup Airtable base with tables:
   - **Leads:** name, email, phone, procedure, location, status, created_at
   - **Surgeons:** name, email, specialty, location, commission_rate, total_leads
   - **Bookings:** lead_id, surgeon_id, booked_at, commission_owed
3. ✅ Connect form to Airtable via Zapier (free tier: 100 tasks/month)
4. ✅ Setup Google Analytics tracking

### Week 1: Surgeon Outreach (Days 3-7)
Manually recruit 10-15 NYC surgeons:

**Email Template:**
```
Subject: Free Patient Leads - SurgeryPreview Launch Partner

Hi Dr. [Name],

I'm launching SurgeryPreview - a platform that pre-qualifies plastic surgery 
patients and matches them with top surgeons in NYC.

Launch Partner Offer:
- First 5 leads: FREE
- After that: Only pay $50-100 when patient books consultation (no upfront cost)
- Patients come pre-qualified with photos, procedure interest, and timeline

Interested in receiving leads for [rhinoplasty/breast aug/etc]?

Best,
Yoshi
SurgeryPreview.co
```

Target surgeons from RealSelf with 4.5+ stars in Manhattan.

---

## Backend Logic (Pseudocode)

### Lead Capture Flow
```javascript
// When form is submitted:
async function handleLeadSubmit(formData) {
    // 1. Save to Airtable
    const lead = await airtable.create('Leads', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        procedure: formData.procedure,
        location: formData.location,
        timeline: formData.timeline,
        status: 'new',
        created_at: new Date()
    });
    
    // 2. Match with 3 surgeons (simple algorithm)
    const surgeons = await matchSurgeons({
        procedure: formData.procedure,
        location: formData.location
    });
    
    // 3. Send lead to surgeons via email
    for (const surgeon of surgeons) {
        await sendEmail({
            to: surgeon.email,
            subject: `New ${formData.procedure} Lead - ${formData.name}`,
            html: generateLeadEmail(formData, surgeon)
        });
        
        // Log lead sent for billing
        await airtable.create('LeadsSent', {
            lead_id: lead.id,
            surgeon_id: surgeon.id,
            sent_at: new Date()
        });
    }
    
    // 4. Send confirmation to patient
    await sendEmail({
        to: formData.email,
        subject: 'Your Top 3 Surgeon Matches',
        html: generatePatientEmail(formData, surgeons)
    });
}

// Simple matching algorithm for MVP:
async function matchSurgeons({ procedure, location }) {
    const allSurgeons = await airtable.select('Surgeons', {
        filterByFormula: `AND(
            {Specialty} = '${procedure}',
            {Location} = '${location}',
            {Status} = 'Active'
        )`,
        sort: [{ field: 'RealSelfRating', direction: 'desc' }],
        maxRecords: 3
    });
    
    return allSurgeons;
}
```

---

## Surgeon Email Template (Auto-send)

```html
Subject: New Rhinoplasty Lead - Sarah Johnson

Dr. [Name],

You have a new pre-qualified patient lead:

PATIENT DETAILS:
- Name: Sarah Johnson
- Email: sarah@email.com
- Phone: (212) 555-0100
- Procedure: Rhinoplasty
- Timeline: 1-3 months
- Location Preference: Manhattan

NOTES FROM PATIENT:
"I'm interested in refining my nasal bridge and tip. Looking for natural results."

ACTION REQUIRED:
Reply to this email or call Sarah directly to book a consultation.

When Sarah books a consultation with you, we'll invoice $75.
(First 5 leads are FREE as a launch partner)

View patient photo: [Secure Link]

Best,
SurgeryPreview Team
```

---

## Patient Confirmation Email

```html
Subject: Your Top 3 Plastic Surgeon Matches

Hi Sarah,

Great news! We've matched you with NYC's top 3 rhinoplasty surgeons:

1. DR. MICHAEL SMITH
   - Board Certified Plastic Surgeon
   - RealSelf Rating: 4.9/5 (247 reviews)
   - Price Range: $8,000 - $12,000
   - Next Available: Jan 18, 2026
   - [Book Consultation]

2. DR. JENNIFER CHEN
   - Board Certified Plastic Surgeon
   - RealSelf Rating: 4.8/5 (189 reviews)
   - Price Range: $9,000 - $14,000
   - Next Available: Jan 15, 2026
   - [Book Consultation]

3. DR. DAVID PATEL
   - Board Certified Plastic Surgeon
   - RealSelf Rating: 4.7/5 (156 reviews)
   - Price Range: $7,500 - $11,000
   - Next Available: Jan 22, 2026
   - [Book Consultation]

All three surgeons will reach out within 24 hours to schedule your consultation.

Questions? Reply to this email.

Best,
SurgeryPreview Team
```

---

## Marketing Plan (Week 2+)

### Paid Ads Budget: $2,000/month
- Google Ads: $1,000/month
  - Keywords: "rhinoplasty nyc", "breast augmentation manhattan", "plastic surgeon near me"
  - Target CPC: $3-8
  - Goal: 125-250 clicks/month → 10-25 leads
  
- Instagram/Facebook Ads: $1,000/month
  - Target: NYC, 25-45 years old, interested in beauty/cosmetics
  - Ad creative: Before/after photos (with permission)
  - Goal: 20-40 leads/month

**Total leads/month:** 30-65 leads  
**Conversion to consultation:** 30-50% (10-30 bookings)  
**Revenue:** $500-4,500/month  
**Net profit:** -$1,500 to +$2,500/month

### Organic (SEO) - Start Early
- Blog posts: "How much does rhinoplasty cost in NYC?"
- Comparison guides: "Top 10 NYC plastic surgeons"
- Procedure guides: "Rhinoplasty recovery timeline"
- Scrape RealSelf reviews, aggregate, add commentary

---

## Scaling Plan

### Month 1-2: Validate
- 10-15 surgeons recruited
- 30-50 leads captured
- 10-20 consultations booked
- $500-3,000 revenue
- **Goal:** Prove surgeons will pay for qualified leads

### Month 3-4: Scale NYC
- 30-50 surgeons
- 100-150 leads/month
- 40-60 consultations/month
- $2,000-9,000/month revenue
- **Goal:** Positive unit economics, hire VA for lead distribution

### Month 5-6: Add AI + Expand to LA
- Raise $100K-250K seed funding
- Build OpenAI Vision API integration for simulations
- Launch in Los Angeles
- Add subscription tier: $19.99/month for unlimited simulations
- **Goal:** $20K-50K/month revenue

---

## OpenAI Vision API Integration (Post-Funding)

```javascript
// When you have funding, add this:
const analyzePhoto = async (imageBuffer, procedure) => {
    const response = await openai.chat.completions.create({
        model: "gpt-4o",  // GPT-4 Omni with vision
        messages: [{
            role: "user",
            content: [
                { 
                    type: "text", 
                    text: `You are a plastic surgery consultant. Analyze this photo for a ${procedure} procedure. Provide:
                    1. Facial analysis (nose shape, symmetry, etc.)
                    2. Recommended approach
                    3. Expected results
                    4. Consultation questions to ask surgeon
                    Keep it professional and educational.`
                },
                { 
                    type: "image_url", 
                    image_url: { 
                        url: `data:image/jpeg;base64,${imageBuffer.toString('base64')}`
                    }
                }
            ]
        }],
        max_tokens: 1000
    });
    
    return response.choices[0].message.content;
};

// Cost: ~$0.02-0.05 per image analysis
// Charge patient: $3-5 per analysis
// Gross margin: 40-60%
```

---

## Success Metrics (Track Weekly)

### Week 1-4:
- ✅ Leads captured: 30+
- ✅ Surgeons recruited: 10+
- ✅ Consultations booked: 5+
- ✅ Revenue: $250+

### Month 2-3:
- ✅ Leads: 100+/month
- ✅ Surgeons: 25+
- ✅ Bookings: 20+/month
- ✅ Revenue: $1,000-3,000/month

### Month 4-6:
- ✅ Break-even or profitable
- ✅ Consistent CAC < $50
- ✅ LTV > $150
- ✅ Ready to raise funding for AI product

---

## Quick Wins (Do This Week)

1. ✅ Deploy landing page to surgerypreview.co (buy domain: $12/year)
2. ✅ Setup Airtable database
3. ✅ Email 20 surgeons from RealSelf
4. ✅ Run $200 Google Ads test campaign
5. ✅ Get first 3 leads
6. ✅ Manually match and send to surgeons
7. ✅ Track if consultation books

**If you get 1 booking from first 10 leads → You have product-market fit.**

---

## Tools & Resources

### No-Code Tools
- Landing page: Vercel, Netlify
- Database: Airtable, Notion
- Email automation: SendGrid, Mailgun
- Form builder: Tally, Typeform
- Analytics: Google Analytics, Mixpanel

### Scraping Tools (for surgeon data)
- Apify (RealSelf scraper)
- Bright Data proxies
- Playwright/Puppeteer
- SerpAPI for Google results

### Payment Processing
- Stripe Connect (for surgeon invoicing)
- PayPal Business
- Bill.com (for B2B invoicing)

---

## Legal Considerations

1. **Medical Disclaimers:** Add to every page
2. **HIPAA Compliance:** Don't store photos long-term without consent
3. **Privacy Policy:** Required before collecting emails
4. **Terms of Service:** Protect yourself legally
5. **Business Structure:** Form an LLC ($200-500)

---

## Next Steps

1. Deploy this HTML landing page
2. Setup Airtable database
3. Email 20 surgeons today
4. Run $200 ad test
5. Get first lead
6. Manually match to surgeons
7. Track result

**Launch in 48 hours. Iterate weekly based on data.**

Questions? Let's refine this together.
