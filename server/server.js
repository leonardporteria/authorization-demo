import express from 'express';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
dotenv.config();

// * MIDDLEWARE
const app = express();

const PORT = process.env.PORT || 8080;

const SECRET_KEY = process.env.JWT_SECRET_KEY;

app.use(express.json());

// * RATE LIMITER CONFIG
const LIMITER_TIMEOUT = 15;
const LIMITER_LIMIT = 5;

const limiter = rateLimit({
  windowMs: LIMITER_TIMEOUT * 60 * 1,
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

app.use('/api', (req, res) => {
  console.log(req.body);

  res.json({ msg: 'From Server!' });
});

app.get('/get', (req, res) => {
  res.download('./pup.bat');
});

app.get('/download', verifyTokenAndRole('admin'), limiter, async (req, res) => {
  // Access user information through req.user
  res.json({ message: 'LOE' });
});

//* CONNECTION
app.listen(PORT, () => {
  console.log(`Listening at port: ${PORT}...`);
});
