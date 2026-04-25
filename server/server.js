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

app.use(cors());
app.use(express.json());

// Initialize database
await initDatabase();

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access token required' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) return res.status(400).json({ error: 'Missing required fields' });
    const existingUser = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser) return res.status(409).json({ error: 'User already exists' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const subdomain = `${name.toLowerCase().replace(/\s+/g, '-')}-${uuidv4().slice(0, 8)}`;
    const userId = uuidv4();
    await db.run(`INSERT INTO users (id, email, password, name, subdomain, created_at) VALUES (?, ?, ?, ?, ?, datetime('now'))`, [userId, email, hashedPassword, name, subdomain]);
    const token = jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, user: { id: userId, email, name, subdomain }, token, message: `欢迎! 你的简历将在: ${subdomain}.resumeBuilder.com` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) return res.status(401).json({ error: 'User not found' });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ error: 'Invalid password' });
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, user: { id: user.id, email: user.email, name: user.name, subdomain: user.subdomain }, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Resume Routes
app.post('/api/resume/generate', authenticateToken, async (req, res) => {
  try {
    const { name, birthDate, email, phone, bio, experience, education, skills } = req.body;
    const userId = req.user.userId;
    const zodiac = getZodiacSign(birthDate);
    const resumeId = uuidv4();
    await db.run(`INSERT OR REPLACE INTO resumes (id, user_id, name, birth_date, email, phone, bio, zodiac, experience, education, skills, theme, background_animation, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`, [resumeId, userId, name, birthDate, email, phone, bio, JSON.stringify(zodiac || {}), JSON.stringify(experience || []), JSON.stringify(education || []), JSON.stringify(skills || []), 'slate', 'yoga']);
    const user = await db.get('SELECT subdomain FROM users WHERE id = ?', [userId]);
    res.json({ success: true, resume: { id: resumeId, name, email, phone, bio }, previewUrl: `/preview/${resumeId}`, publicUrl: `https://${user.subdomain}.resumeBuilder.com` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate resume' });
  }
});

app.get('/api/resume/:resumeId', authenticateToken, async (req, res) => {
  try {
    const resume = await db.get(`SELECT * FROM resumes WHERE id = ? AND user_id = ?`, [req.params.resumeId, req.user.userId]);
    if (!resume) return res.status(404).json({ error: 'Resume not found' });
    res.json({ success: true, resume: { ...resume, experience: JSON.parse(resume.experience), education: JSON.parse(resume.education), skills: JSON.parse(resume.skills) } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve resume' });
  }
});

app.get('/api/resumes', authenticateToken, async (req, res) => {
  try {
    const resumes = await db.all(`SELECT id, name, zodiac, created_at FROM resumes WHERE user_id = ? ORDER BY created_at DESC`, [req.user.userId]);
    res.json({ success: true, resumes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve resumes' });
  }
});

// Public Routes
app.get('/preview/:resumeId', async (req, res) => {
  try {
    const resume = await db.get('SELECT * FROM resumes WHERE id = ?', [req.params.resumeId]);
    if (!resume) return res.status(404).send('Resume not found');
    const resumeData = { ...resume, experience: JSON.parse(resume.experience), education: JSON.parse(resume.education), skills: JSON.parse(resume.skills), zodiac: JSON.parse(resume.zodiac) };
    const html = generateResumeHTML(resumeData);
    res.header('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error loading resume');
  }
});

app.get('/subdomain/:subdomain', async (req, res) => {
  try {
    const user = await db.get('SELECT * FROM users WHERE subdomain = ?', [req.params.subdomain]);
    if (!user) return res.status(404).send('User not found');
    const resume = await db.get(`SELECT * FROM resumes WHERE user_id = ? ORDER BY created_at DESC LIMIT 1`, [user.id]);
    if (!resume) return res.status(404).send('Resume not found');
    const resumeData = { ...resume, experience: JSON.parse(resume.experience), education: JSON.parse(resume.education), skills: JSON.parse(resume.skills), zodiac: JSON.parse(resume.zodiac) };
    const html = generateResumeHTML(resumeData);
    res.header('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error loading resume');
  }
});

// Zodiac Routes
app.get('/api/zodiac/all', (req, res) => {
  res.json({ success: true, zodiacSigns: Object.values(zodiacSigns) });
});

app.get('/api/zodiac/:date', (req, res) => {
  try {
    const zodiac = getZodiacSign(req.params.date);
    res.json({ success: true, zodiac });
  } catch (error) {
    res.status(400).json({ error: 'Invalid date format' });
  }
});

// Health Check
app.get('/health', (req, res) => res.json({ status: 'OK', timestamp: new Date() }));

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Resume Builder API',
    version: '1.0.0',
    endpoints: {
      auth: { register: 'POST /api/auth/register', login: 'POST /api/auth/login' },
      resume: { generate: 'POST /api/resume/generate', get: 'GET /api/resume/:resumeId', list: 'GET /api/resumes' },
      public: { preview: 'GET /preview/:resumeId', subdomain: 'GET /subdomain/:subdomain' }
    }
  });
});

app.listen(PORT, () => {
  console.log(`\n╔════════════════════════════════════════╗\n║   Resume Builder Server Started        ║\n║   http://localhost:${PORT}               ║\n╚════════════════════════════════════════╝\n`);
});

export default app;
