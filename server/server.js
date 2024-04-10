import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
dotenv.config();

// * MIDDLEWARE
const app = express();

const PORT = process.env.PORT || 8080;

const SECRET_KEY = process.env.JWT_SECRET_KEY;

app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));

// * RATE LIMITER CONFIG
const LIMITER_TIMEOUT_MINUTES = 15;
const LIMITER_LIMIT = 5;

const limiter = rateLimit({
  windowMs: LIMITER_TIMEOUT_MINUTES * 60 * 1,
  max: LIMITER_LIMIT,
  message: 'Too many attempts, please try again later.',
});

// Middleware to verify JWT
const verifyTokenAndRole = (role) => (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Unauthorized: Invalid token' });
    }

    if (user.role !== role) {
      return res
        .status(403)
        .json({ message: 'Unauthorized: Insufficient role' });
    }

    req.user = user;
    next();
  });
};

app.use((err, req, res, next) => {
  console.log('MIDDLEWARE');
  console.error(err.stack);
  res.status(500).send('Something broke!');
  next();
});

app.use('/api/test', (req, res) => {
  console.log('Deployed Endpoint');
  res.json({ msg: 'Hello From Render!' });
});

app.use('/api/limited', limiter, (req, res) => {
  console.log('Deployed Endpoint');
  res.json({ msg: 'Hello From Render!' });
});

app.use('/api/public', (req, res) => {
  console.log('Public Endpoint');
  res.download('./pup-site-public.html', 'pup-site-public.html');
});

app.use('/api/admin', limiter, verifyTokenAndRole('admin'), (req, res) => {
  console.log('Admin Endpoint');
  res.download('./pup-site.html', 'pup-site.html');
});

app.use('/api/manager', limiter, verifyTokenAndRole('manager'), (req, res) => {
  console.log('Manager Endpoint');
  res.download('./pup-site.html', 'pup-site.html');
});

// POST new auth (public route)
app.post('/api/auth', limiter, async (req, res) => {
  console.log(req.body);

  const users = [
    {
      id: 0,
      username: process.env.ADMIN_USERNAME,
      password: process.env.ADMIN_PASSWORD,
      role: 'admin',
    },
    {
      id: 1,
      username: process.env.MANAGER_USERNAME,
      password: process.env.MANAGER_PASSWORD,
      role: 'manager',
    },
    {
      id: 2,
      username: process.env.USER_USERNAME,
      password: process.env.USER_PASSWORD,
      role: 'user',
    },
  ];

  const { username, password, role } = req.body;

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: 'Authentication failed' });
  }

  if (role !== user.role) {
    return res.status(403).json({ message: 'Unauthorized: Insufficient role' });
  }

  const token = jwt.sign(
    { userId: user.id, username: user.username, role: user.role },
    SECRET_KEY,
    { expiresIn: '1h' }
  );

  res.json({ message: 'POST new auth', token });
});

//* CONNECTION
app.listen(PORT, () => {
  console.log(`Listening at port: ${PORT}...`);
});
