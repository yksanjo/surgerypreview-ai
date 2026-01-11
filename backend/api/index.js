// SurgeryPreview Test API for Vercel
import express from 'express';
import cors from 'cors';

const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    status: 'ok',
    message: 'SurgeryPreview Test API is working!',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    endpoints: {
      test: 'GET /api/test',
      health: 'GET /health',
      leads: 'POST /api/leads'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'SurgeryPreview Test API'
  });
});

// Lead endpoint
app.post('/api/leads', (req, res) => {
  console.log('📝 Lead received:', req.body);
  
  // Simulate processing
  const leadData = req.body;
  
  // Validate required fields
  if (!leadData.name || !leadData.email || !leadData.phone || !leadData.procedure) {
    return res.status(400).json({ 
      error: 'Missing required fields',
      required: ['name', 'email', 'phone', 'procedure']
    });
  }
  
  // Simulate matching with surgeons
  const matchedSurgeons = [
    {
      id: 'test_surgeon_1',
      name: 'Dr. Test Surgeon 1',
      specialty: leadData.procedure,
      location: leadData.location || 'NYC',
      rating: 4.8,
      matchScore: 95
    },
    {
      id: 'test_surgeon_2',
      name: 'Dr. Test Surgeon 2',
      specialty: leadData.procedure,
      location: leadData.location || 'NYC',
      rating: 4.7,
      matchScore: 88
    },
    {
      id: 'test_surgeon_3',
      name: 'Dr. Test Surgeon 3',
      specialty: leadData.procedure,
      location: leadData.location || 'NYC',
      rating: 4.6,
      matchScore: 82
    }
  ];
  
  // Return success response
  res.json({
    success: true,
    message: 'Lead captured successfully (test mode)',
    leadId: `test_lead_${Date.now()}`,
    matchedSurgeons: matchedSurgeons.length,
    surgeons: matchedSurgeons,
    nextSteps: [
      'Surgeons will contact you within 24 hours',
      'Check your email for confirmation',
      'Schedule consultations with your top choices'
    ],
    testMode: true,
    timestamp: new Date().toISOString()
  });
});

// Handle OPTIONS for CORS preflight
app.options('*', cors());

// Default route
app.get('/', (req, res) => {
  res.json({
    service: 'SurgeryPreview Test API',
    status: 'running',
    documentation: 'See /api/test for available endpoints'
  });
});

// Export for Vercel
export default app;