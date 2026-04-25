import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { initDatabase, db } from './db.js';
import { generateResumeHTML } from './resume-generator.js';
import { zodiacSigns, getZodiacSign } from './zodiac.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
initDatabase();

// ┌─────────────────────────────────────────────┐
// │ Authentication Routes                       │
// └─────────────────────────────────────────────┘

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

// 查找用户
    const findUser = new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    const existingUser = await findUser;
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Generate unique subdomain
    const subdomain = `${name.toLowerCase().replace(/\s+/g, '-')}-${uuidv4().slice(0, 8)}`;
    
    // Create user
    const userId = uuidv4();
    const stmt = db.prepare(`
      INSERT INTO users (id, email, password, name, subdomain, created_at)
      VALUES (?, ?, ?, ?, ?, datetime('now'))
    `);
    
    stmt.run(userId, email, hashedPassword, name, subdomain);

    // Generate JWT
    const token = jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      user: { id: userId, email, name, subdomain },
      token,
      message: `Welcome! Your resume will be available at: ${subdomain}.resumeBuilder.com`
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Find user
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Generate JWT
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name, subdomain: user.subdomain },
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// ┌─────────────────────────────────────────────┐
// │ Resume Routes                               │
// └─────────────────────────────────────────────┘

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Create/Update resume
app.post('/api/resume/generate', authenticateToken, (req, res) => {
  try {
    const { name, birthDate, email, phone, bio, experience, education, skills } = req.body;
    const userId = req.user.userId;

    // Get zodiac sign
    const zodiac = getZodiacSign(birthDate);

    // Create resume object
    const resume = {
      id: uuidv4(),
      userId,
      name,
      birthDate,
      email,
      phone,
      bio,
      zodiac,
      experience: experience || [],
      education: education || [],
      skills: skills || [],
      theme: req.body.theme || 'slate',
      backgroundAnimation: req.body.backgroundAnimation || 'yoga',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Save to database
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO resumes (
        id, user_id, name, birth_date, email, phone, bio, zodiac, 
        experience, education, skills, theme, background_animation, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `);

    stmt.run(
      resume.id,
      userId,
      name,
      birthDate,
      email,
      phone,
      bio,
      zodiac,
      JSON.stringify(experience || []),
      JSON.stringify(education || []),
      JSON.stringify(skills || []),
      resume.theme,
      resume.backgroundAnimation
    );

    res.json({
      success: true,
      resume,
      previewUrl: `/preview/${resume.id}`,
      publicUrl: `https://${db.prepare('SELECT subdomain FROM users WHERE id = ?').get(userId).subdomain}.resumeBuilder.com`
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate resume' });
  }
});

// Get user resume
app.get('/api/resume/:resumeId', authenticateToken, (req, res) => {
  try {
    const resume = db.prepare(`
      SELECT * FROM resumes WHERE id = ? AND user_id = ?
    `).get(req.params.resumeId, req.user.userId);

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    res.json({
      success: true,
      resume: {
        ...resume,
        experience: JSON.parse(resume.experience),
        education: JSON.parse(resume.education),
        skills: JSON.parse(resume.skills)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve resume' });
  }
});

// List all user resumes
app.get('/api/resumes', authenticateToken, (req, res) => {
  try {
    const resumes = db.prepare(`
      SELECT id, name, zodiac, created_at FROM resumes WHERE user_id = ? ORDER BY created_at DESC
    `).all(req.user.userId);

    res.json({
      success: true,
      resumes
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve resumes' });
  }
});

// ┌─────────────────────────────────────────────┐
// │ Public Resume Preview Routes                │
// └─────────────────────────────────────────────┘

// Public resume view by resumeId
app.get('/preview/:resumeId', (req, res) => {
  try {
    const resume = db.prepare('SELECT * FROM resumes WHERE id = ?').get(req.params.resumeId);
    
    if (!resume) {
      return res.status(404).send('Resume not found');
    }

    const resumeData = {
      ...resume,
      experience: JSON.parse(resume.experience),
      education: JSON.parse(resume.education),
      skills: JSON.parse(resume.skills)
    };

    const html = generateResumeHTML(resumeData);
    res.header('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error loading resume');
  }
});

// Public resume view by subdomain
app.get('/subdomain/:subdomain', (req, res) => {
  try {
    const user = db.prepare('SELECT * FROM users WHERE subdomain = ?').get(req.params.subdomain);
    
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Get the latest resume for this user
    const resume = db.prepare(`
      SELECT * FROM resumes WHERE user_id = ? ORDER BY created_at DESC LIMIT 1
    `).get(user.id);

    if (!resume) {
      return res.status(404).send('Resume not found');
    }

    const resumeData = {
      ...resume,
      experience: JSON.parse(resume.experience),
      education: JSON.parse(resume.education),
      skills: JSON.parse(resume.skills)
    };

    const html = generateResumeHTML(resumeData);
    res.header('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error loading resume');
  }
});

// ┌─────────────────────────────────────────────┐
// │ Zodiac & Theme Routes                       │
// └─────────────────────────────────────────────┘

app.get('/api/zodiac/all', (req, res) => {
  res.json({
    success: true,
    zodiacSigns: Object.values(zodiacSigns)
  });
});

app.get('/api/zodiac/:date', (req, res) => {
  try {
    const zodiac = getZodiacSign(req.params.date);
    res.json({
      success: true,
      zodiac
    });
  } catch (error) {
    res.status(400).json({ error: 'Invalid date format' });
  }
});

// ┌─────────────────────────────────────────────┐
// │ Static Files & Health Check                 │
// └─────────────────────────────────────────────┘

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Resume Builder API',
    version: '1.0.0',
    documentation: '/api-docs',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login'
      },
      resume: {
        generate: 'POST /api/resume/generate',
        get: 'GET /api/resume/:resumeId',
        list: 'GET /api/resumes'
      },
      public: {
        preview: 'GET /preview/:resumeId',
        subdomain: 'GET /subdomain/:subdomain'
      }
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   Resume Builder Server Started         ║
║   http://localhost:${PORT}                   ║
║════════════════════════════════════════╝
  `);
});

export default app;
