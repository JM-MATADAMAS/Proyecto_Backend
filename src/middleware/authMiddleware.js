const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;
  
  if (!authorizationHeader) {
    return res.status(401).json({
      message: 'Authorization header missing'
    });
  }

  const tokenParts = authorizationHeader.split(' ');
  
  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    return res.status(401).json({
      message: 'Malformed token'
    });
  }

  try {
    const validToken = jwt.verify(tokenParts[1], process.env.TOP_SECRET);
    req.userData = validToken;
    console.log('Token válido');
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Invalid Token'
    });
  }
};

module.exports = authMiddleware;
