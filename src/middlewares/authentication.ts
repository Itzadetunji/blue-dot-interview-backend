import jwt from "jsonwebtoken";
import TokenBlacklist from "../models/tokenBlacklist";

// Define JWT payload interface
interface JwtPayload {
  userId: string;
  fullName: string;
  email: string;
}

const auth = async (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authentication invalid" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Check if the token is blacklisted
    const blacklistedToken = await TokenBlacklist.findOne({ token });
    if (blacklistedToken) {
      return res.status(401).json({ error: "Token has been blacklisted" });
    }

    // Verify the token
    const secret = process.env.JWT_SECRET || "";
    const payload = jwt.verify(token, secret) as JwtPayload;

    req.user = {
      userId: payload.userId,
      fullName: payload.fullName,
      email: payload.email,
    };

    next();
  } catch (error) {
    return res.status(401).json({ error: "Authentication invalid" });
  }
};

export default auth;
