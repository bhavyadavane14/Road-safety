const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ error: 'No authorization token, access denied' });
  }

  const token = authHeader.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'No authorization token, access denied' });
  }

  try {
    const JWT_SECRET = process.env.JWT_SECRET || 'roadsos_secret_key_2026';
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token verification failed, authorization denied' });
  }
};

module.exports = auth;
