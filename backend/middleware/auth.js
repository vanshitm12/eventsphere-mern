const jwt = require('jsonwebtoken');

exports.authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1]; // "Bearer <token>"
  if (!token) return res.status(401).json({ message: "Invalid token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id }; // attach user ID to request
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" }); // invalid token
  }
};