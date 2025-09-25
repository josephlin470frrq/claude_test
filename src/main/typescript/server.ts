import express from 'express';
import session from 'express-session';
import passport from 'passport';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';

import { db } from '@services/database';
import { configurePassport } from '@utils/passport-config';
import { authRoutes, civilRoutes } from '@api/index';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'freq0097-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

configurePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use('/css', express.static(path.join(__dirname, '../resources/static/css')));
app.use('/js', express.static(path.join(__dirname, '../resources/static/js')));

app.use('/auth', authRoutes);
app.use('/api/civil', civilRoutes);

app.get('/civil_login', (req, res) => {
  const error = req.query.error as string;
  let templatePath = path.join(__dirname, '../resources/templates/civil_login.html');

  if (error) {
    console.log('Login error:', error);
  }

  res.sendFile(templatePath);
});

app.get('/civil_new', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, '../resources/templates/civil_new.html'));
});

app.get('/civil_main', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, '../resources/templates/civil_main.html'));
});

app.get('/', (req, res) => {
  res.redirect('/civil_login');
});

function requireAuth(req: any, res: any, next: any) {
  if (!req.session?.civilId) {
    return res.redirect('/civil_login');
  }
  next();
}

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const startServer = async () => {
  try {
    const dbConnected = await db.testConnection();
    if (!dbConnected) {
      console.error('Failed to connect to database. Please check your database configuration.');
      process.exit(1);
    }

    app.listen(PORT, () => {
      console.log(`✅ Freq0097 server running on http://localhost:${PORT}`);
      console.log(`📊 Database connected successfully`);
      console.log(`🔐 Authentication configured with Google OAuth`);
      console.log(`🌐 CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();