const jwt = require('jsonwebtoken');

exports.protect = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user from token
      req.user = decoded;
      console.log('Decoded user in protect middleware:', req.user); // Log decoded user

      next(); // Call next only if token is valid
    } catch (error) {
      console.error('Token verification failed:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' }); // Explicitly return
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' }); // Explicitly return
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) { // Added !req.user check
      return res.status(403).json({ error: 'Not authorized for this role' });
    }
    next();
  };
};
