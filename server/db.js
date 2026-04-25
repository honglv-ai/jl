import Database from './db-helper.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '../data/resumes.db');

export let db;

export async function initDatabase() {
  db = new Database(dbPath);

  // Create users table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      subdomain TEXT UNIQUE NOT NULL,
      avatar_url TEXT,
      bio TEXT,
      contact_email TEXT,
      phone TEXT,
      location TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create resumes table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS resumes (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      birth_date TEXT,
      email TEXT,
      phone TEXT,
      bio TEXT,
      zodiac TEXT,
      experience TEXT,
      education TEXT,
      skills TEXT,
      theme TEXT DEFAULT 'slate',
      background_animation TEXT DEFAULT 'yoga',
      is_primary BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // Create templates table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS templates (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      background_type TEXT NOT NULL,
      animation_type TEXT NOT NULL,
      color_scheme TEXT NOT NULL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Insert default templates
  const defaultTemplates = [
    { id: 'template-1', name: '瑜伽身心', background_type: 'yoga', animation_type: 'gentle_flow', color_scheme: 'slate' },
    { id: 'template-2', name: '跑步活力', background_type: 'running', animation_type: 'dynamic_motion', color_scheme: 'slate' },
    { id: 'template-3', name: '健身能量', background_type: 'fitness', animation_type: 'strength_curve', color_scheme: 'slate' },
    { id: 'template-4', name: '游泳流动', background_type: 'swimming', animation_type: 'wave_motion', color_scheme: 'slate' },
    { id: 'template-5', name: '骑行风采', background_type: 'cycling', animation_type: 'circular_motion', color_scheme: 'slate' },
  ];

  try {
    const count = await db.get('SELECT COUNT(*) as count FROM templates');
    if (count.count === 0) {
      for (const template of defaultTemplates) {
        await db.run(
          `INSERT INTO templates (id, name, background_type, animation_type, color_scheme) VALUES (?, ?, ?, ?, ?)`,
          [template.id, template.name, template.background_type, template.animation_type, template.color_scheme]
        );
      }
    }
  } catch (error) {
    console.error('Error inserting templates:', error);
  }

  console.log('✓ Database initialized successfully');
}

export function getRandomTemplate() {
  return db.get('SELECT * FROM templates ORDER BY RANDOM() LIMIT 1');
}

export default db;
