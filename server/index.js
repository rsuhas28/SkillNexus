import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import assessmentRoutes from './routes/assessmentRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import industryRoutes from './routes/industryRoutes.js';
import opportunityRoutes from './routes/opportunityRoutes.js';
import academicianRoutes from './routes/academicianRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost:')) {
      callback(null, true);
    } else {
      callback(null, true); // Permissive in dev mode
    }
  },
  credentials: true
}));

// Body parser
app.use(express.json());

// Root route - friendly status page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>SkillNexus Backend API</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
        .card { background: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 2.5rem; max-width: 520px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); text-align: center; }
        h1 { margin-top: 0; font-size: 1.8rem; color: #60a5fa; }
        p { color: #94a3b8; font-size: 0.95rem; line-height: 1.6; }
        .badge { display: inline-block; background: #065f46; color: #34d399; padding: 0.25rem 0.75rem; border-radius: 9999px; font-weight: 600; font-size: 0.85rem; margin-bottom: 1rem; }
        .btn { display: inline-block; margin: 0.5rem; padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: 600; text-decoration: none; transition: 0.2s; }
        .btn-primary { background: #3b82f6; color: white; }
        .btn-primary:hover { background: #2563eb; }
        .btn-secondary { background: #334155; color: #e2e8f0; }
        .btn-secondary:hover { background: #475569; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="badge">● Server Active & Running</div>
        <h1>🚀 SkillNexus Backend API</h1>
        <p>The SkillNexus Node.js/Express API server is running successfully on <strong>port ${PORT}</strong>.</p>
        <p>To use the full web platform, visit the React frontend application below:</p>
        <div style="margin-top: 1.5rem;">
          <a class="btn btn-primary" href="http://localhost:3000" target="_blank">Open Frontend App (Port 3000)</a>
          <a class="btn btn-secondary" href="/api/health">Check API Health</a>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    product: 'SkillNexus',
    phases: '1-10 complete',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/industry', industryRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/academicians', academicianRoutes);
app.use('/api/analytics', analyticsRoutes);


// 404 handler for unknown API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `SkillNexus API route ${req.originalUrl} not found.`,
    code: 'ROUTE_NOT_FOUND'
  });
});

// Centralized error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 SkillNexus Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
});

export default app;
