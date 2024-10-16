import type { Request, Response, NextFunction } from "express";
import UnauthenticatedError from "../utils/errors/unauthenticated";
import jwt from "jsonwebtoken";

// Define JWT payload interface
interface JwtPayload {
  userId: string;
  fullName: string;
  email: string;
}

const auth = async (req: any, res: any, next: any) => {
  // Check for authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authentication invalid" }); // Handle the error gracefully
  }

  const token = authHeader.split(" ")[1];

  try {
    const secret = process.env.JWT_SECRET || "";
    const payload = jwt.verify(token, secret) as JwtPayload;

    // Attach the user information from the JWT payload to the request object
    req.user = {
      userId: payload.userId,
      fullName: payload.fullName,
      email: payload.email,
    };

    next();
  } catch (error) {
    return res.status(401).json({ error: "Authentication invalid" }); // Handle the error gracefully
  }
};

export default auth;
