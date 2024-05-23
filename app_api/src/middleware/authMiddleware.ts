import { validateToken } from "../utils/jwt";

function authMiddleware(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = validateToken(token);
    if(req.method !== 'PUT') {
      req.body.user = decoded;
    }
    next();
  } catch (error: any) {
    return res.status(403).json({ message: "Invalid token" });
  }
}

export default authMiddleware;