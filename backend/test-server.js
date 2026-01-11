// Simple test server for SurgeryPreview
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    status: 'ok',
    message: 'SurgeryPreview API is working!',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Mock lead endpoint for testing
app.post('/api/leads', (req, res) => {
  console.log('Test lead received:', req.body);
  
  // Simulate processing delay
  setTimeout(() => {
    res.json({
      success: true,
      message: 'Lead captured successfully (test mode)',
      data: req.body,
      matchedSurgeons: 3,
      testMode: true
    });
  }, 1000);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 SurgeryPreview Test Server running on port ${PORT}`);
  console.log(`📡 Test endpoint: http://localhost:${PORT}/api/test`);
  console.log(`❤️  Health check: http://localhost:${PORT}/health`);
  console.log(`📝 Lead endpoint: POST http://localhost:${PORT}/api/leads`);
});