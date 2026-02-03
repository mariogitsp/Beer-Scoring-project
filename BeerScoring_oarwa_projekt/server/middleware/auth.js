const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, 'SeCr3tK3y');
    req.user = {
      id: decoded.userId,
      role: decoded.role 
    };
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Invalid token' });
  }
};
