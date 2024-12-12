import { JWT_SECRET } from "./config.js";  // Import JWT_SECRET from config
import { verify } from "jsonwebtoken";  // Import verify function from jsonwebtoken

const authmiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization; 

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).json({ error: "Forbidden: No token provided" });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verify(token, JWT_SECRET);  // Verify the token using JWT_SECRET
    if (decoded.userId) {
      req.userId = decoded.userId;  // Attach userId to the request object
      next();  // Proceed to the next middleware or route handler
    } else {
      return res.status(403).json({ error: "Forbidden: Invalid token" });
    }
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
  }
};

export default authmiddleware;  // Directly export the middleware
