const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1];
    const secretKey = process.env.JWT_SECRET;
  
    try {
      const decoded = jwt.verify(token, secretKey);
      req.userId = decoded.userId; // Attach user ID to the request for later use
      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        res.status(401).json({ error: 'Token Expired' });
      } else {
        res.status(401).json({ error: 'Invalid token' });
      }
    }
  } else {
    res.status(401).json({ error: 'Login First' });
  }
}

module.exports = verifyToken;
