// SurgeryPreview Backend API - MVP Version
// Deploy to: Vercel, Railway, or Render (all have free tiers)

import express from 'express';
import cors from 'cors';
import Airtable from 'airtable';
import sgMail from '@sendgrid/mail';

const app = express();
app.use(cors());
app.use(express.json());

// Configure Airtable (free tier: 1,200 records)
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
  .base(process.env.AIRTABLE_BASE_ID);

// Configure SendGrid (free tier: 100 emails/day)
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// ==========================================
// LEAD CAPTURE ENDPOINT
// ==========================================
app.post('/api/leads', async (req, res) => {
  try {
    const leadData = req.body;
    
    // 1. Validate required fields
    if (!leadData.name || !leadData.email || !leadData.phone || !leadData.procedure) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // 2. Save lead to Airtable
    const lead = await base('Leads').create({
      Name: leadData.name,
      Email: leadData.email,
      Phone: leadData.phone,
      Procedure: leadData.procedure,
      Location: leadData.location,
      Timeline: leadData.timeline,
      Notes: leadData.notes,
      Status: 'New',
      CreatedAt: new Date().toISOString()
    });
    
    console.log('Lead captured:', lead.id);
    
    // 3. Match with surgeons
    const matchedSurgeons = await matchSurgeons(
      leadData.procedure, 
      leadData.location
    );
    
    console.log('Matched surgeons:', matchedSurgeons.length);
    
    // 4. Send lead to matched surgeons
    for (const surgeon of matchedSurgeons) {
      await sendLeadToSurgeon(surgeon, leadData);
      
      // Log lead distribution for billing
      await base('LeadDistribution').create({
        LeadId: lead.id,
        SurgeonId: surgeon.id,
        SurgeonName: surgeon.name,
        SurgeonEmail: surgeon.email,
        SentAt: new Date().toISOString(),
        Status: 'Sent'
      });
    }
    
    // 5. Send confirmation email to patient
    await sendPatientConfirmation(leadData.email, matchedSurgeons);
    
    // 6. Return success
    res.json({
      success: true,
      message: 'Lead captured and distributed successfully',
      matchedSurgeons: matchedSurgeons.length
    });
    
  } catch (error) {
    console.error('Error capturing lead:', error);
    res.status(500).json({ error: 'Failed to process lead' });
  }
});

// ==========================================
// SURGEON MATCHING ALGORITHM (MVP)
// ==========================================
async function matchSurgeons(procedure, location) {
  try {
    // Simple matching: filter by procedure and location, sort by rating
    const records = await base('Surgeons')
      .select({
        filterByFormula: `AND(
          FIND('${procedure}', {Specialties}),
          {Location} = '${location}',
          {Status} = 'Active'
        )`,
        sort: [{ field: 'RealSelfRating', direction: 'desc' }],
        maxRecords: 3
      })
      .firstPage();
    
    return records.map(record => ({
      id: record.id,
      name: record.get('Name'),
      email: record.get('Email'),
      phone: record.get('Phone'),
      specialties: record.get('Specialties'),
      location: record.get('Location'),
      priceRange: record.get('PriceRange'),
      realSelfRating: record.get('RealSelfRating'),
      reviewCount: record.get('ReviewCount'),
      website: record.get('Website')
    }));
  } catch (error) {
    console.error('Error matching surgeons:', error);
    return [];
  }
}

// ==========================================
// EMAIL TO SURGEON (LEAD NOTIFICATION)
// ==========================================
async function sendLeadToSurgeon(surgeon, leadData) {
  const emailContent = {
    to: surgeon.email,
    from: 'leads@surgerypreview.co',
    subject: `New ${leadData.procedure} Lead - ${leadData.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0A4D68;">New Pre-Qualified Patient Lead</h2>
        
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Patient Details</h3>
          <p><strong>Name:</strong> ${leadData.name}</p>
          <p><strong>Email:</strong> ${leadData.email}</p>
          <p><strong>Phone:</strong> ${leadData.phone}</p>
          <p><strong>Procedure:</strong> ${leadData.procedure}</p>
          <p><strong>Timeline:</strong> ${leadData.timeline}</p>
          <p><strong>Location Preference:</strong> ${leadData.location}</p>
        </div>
        
        ${leadData.notes ? `
          <div style="background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107;">
            <strong>Patient Notes:</strong>
            <p>${leadData.notes}</p>
          </div>
        ` : ''}
        
        <div style="margin: 30px 0; padding: 20px; background: #e8f4f8; border-radius: 8px;">
          <h3 style="color: #0A4D68; margin-top: 0;">Next Steps</h3>
          <ol>
            <li>Contact ${leadData.name} within 24 hours for best conversion</li>
            <li>Schedule a consultation</li>
            <li>When consultation is booked, you'll be invoiced $75</li>
          </ol>
          <p style="font-size: 12px; color: #666;">
            This lead was distributed to 3 surgeons. First to respond typically wins the patient.
          </p>
        </div>
        
        <p style="font-size: 12px; color: #999; border-top: 1px solid #ddd; padding-top: 15px;">
          SurgeryPreview | <a href="mailto:support@surgerypreview.co">support@surgerypreview.co</a>
        </p>
      </div>
    `
  };
  
  try {
    await sgMail.send(emailContent);
    console.log(`Lead email sent to ${surgeon.name}`);
  } catch (error) {
    console.error(`Error sending email to ${surgeon.name}:`, error);
  }
}

// ==========================================
// EMAIL TO PATIENT (CONFIRMATION + MATCHES)
// ==========================================
async function sendPatientConfirmation(email, surgeons) {
  const emailContent = {
    to: email,
    from: 'team@surgerypreview.co',
    subject: 'Your Top 3 Plastic Surgeon Matches',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #0A4D68;">Your Surgeon Matches Are Ready! 🎉</h1>
        
        <p style="font-size: 16px; line-height: 1.6;">
          Great news! We've matched you with ${surgeons.length} top-rated, board-certified plastic surgeons in your area.
        </p>
        
        ${surgeons.map((surgeon, index) => `
          <div style="background: white; border: 2px solid #e0e0e0; border-radius: 12px; padding: 20px; margin: 20px 0;">
            <div style="display: flex; align-items: center; margin-bottom: 15px;">
              <div style="background: linear-gradient(135deg, #05BFDB, #00C9A7); color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 20px; margin-right: 15px;">
                ${index + 1}
              </div>
              <h2 style="margin: 0; color: #0A4D68;">${surgeon.name}</h2>
            </div>
            
            <p style="color: #666; margin: 5px 0;">
              ⭐ RealSelf Rating: ${surgeon.realSelfRating}/5 
              (${surgeon.reviewCount} reviews)
            </p>
            <p style="color: #666; margin: 5px 0;">
              💰 Price Range: ${surgeon.priceRange}
            </p>
            <p style="color: #666; margin: 5px 0;">
              📍 Location: ${surgeon.location}
            </p>
            
            ${surgeon.website ? `
              <a href="${surgeon.website}" 
                 style="display: inline-block; margin-top: 15px; padding: 12px 24px; background: linear-gradient(135deg, #0A4D68, #088395); color: white; text-decoration: none; border-radius: 25px; font-weight: bold;">
                View Profile
              </a>
            ` : ''}
          </div>
        `).join('')}
        
        <div style="background: #f0f8ff; padding: 20px; border-radius: 12px; border-left: 4px solid #05BFDB; margin: 30px 0;">
          <h3 style="color: #0A4D68; margin-top: 0;">What Happens Next?</h3>
          <ul style="line-height: 1.8;">
            <li>All three surgeons will reach out within 24 hours</li>
            <li>Schedule consultations with your top choices (typically free)</li>
            <li>Compare their recommendations and pricing</li>
            <li>Choose the surgeon you feel most comfortable with</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <p style="color: #666;">Have questions? We're here to help!</p>
          <a href="mailto:support@surgerypreview.co" style="color: #05BFDB; text-decoration: none;">
            support@surgerypreview.co
          </a>
        </div>
        
        <p style="font-size: 12px; color: #999; text-align: center; border-top: 1px solid #ddd; padding-top: 15px;">
          SurgeryPreview | Connecting patients with top-rated surgeons
        </p>
      </div>
    `
  };
  
  try {
    await sgMail.send(emailContent);
    console.log(`Confirmation email sent to patient`);
  } catch (error) {
    console.error('Error sending patient email:', error);
  }
}

// ==========================================
// WEBHOOK: SURGEON BOOKING CONFIRMATION
// ==========================================
app.post('/api/bookings', async (req, res) => {
  try {
    const { leadId, surgeonId, bookingDate } = req.body;
    
    // Log the booking
    await base('Bookings').create({
      LeadId: leadId,
      SurgeonId: surgeonId,
      BookingDate: bookingDate,
      CommissionOwed: 75.00, // $75 per booking
      Status: 'Booked',
      CreatedAt: new Date().toISOString()
    });
    
    // Update lead status
    await base('Leads').update(leadId, {
      Status: 'Booked',
      BookedWith: surgeonId
    });
    
    res.json({ success: true, message: 'Booking recorded' });
    
  } catch (error) {
    console.error('Error recording booking:', error);
    res.status(500).json({ error: 'Failed to record booking' });
  }
});

// ==========================================
// ANALYTICS ENDPOINT
// ==========================================
app.get('/api/analytics', async (req, res) => {
  try {
    const leads = await base('Leads').select().all();
    const bookings = await base('Bookings').select().all();
    
    const analytics = {
      totalLeads: leads.length,
      totalBookings: bookings.length,
      conversionRate: ((bookings.length / leads.length) * 100).toFixed(2) + '%',
      revenueGenerated: bookings.length * 75,
      leadsByProcedure: {},
      leadsByLocation: {}
    };
    
    // Aggregate by procedure
    leads.forEach(lead => {
      const procedure = lead.get('Procedure');
      analytics.leadsByProcedure[procedure] = 
        (analytics.leadsByProcedure[procedure] || 0) + 1;
    });
    
    // Aggregate by location
    leads.forEach(lead => {
      const location = lead.get('Location');
      analytics.leadsByLocation[location] = 
        (analytics.leadsByLocation[location] || 0) + 1;
    });
    
    res.json(analytics);
    
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// ==========================================
// HEALTH CHECK
// ==========================================
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 SurgeryPreview API running on port ${PORT}`);
});

export default app;
