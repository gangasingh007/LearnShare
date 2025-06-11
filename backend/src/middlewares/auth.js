const jwt = require('jsonwebtoken');

const authMiddleware=(req, res, next) =>{
  // 1. Get token from Authorization header
  const authHeader = req.headers.authorization;
  console.log (authHeader)

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];
  console.log(token)

  try {
    // 2. Verify token using secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded)

    // 3. Attach user info to request object
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    next(); // Continue to the route
  } catch (error) {
    return res.status(401).json({ message: error });
  }
}

module.exports = authMiddleware;
