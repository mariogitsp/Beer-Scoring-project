const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-only-secret';

module.exports = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = {
      id: decoded.userId,
      role: decoded.role 
    };
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Invalid token' });
  }
};
