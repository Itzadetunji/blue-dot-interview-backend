import type { Request, Response, NextFunction } from "express";
import UnauthenticatedError from "../utils/errors/unauthenticated";
import jwt from "jsonwebtoken";

// Define JWT payload interface
interface JwtPayload {
	userId: string;
	username: string;
	fullName: string;
	email: string;
}

const auth = async (req: Request, res: Response, next: NextFunction) => {
	// Check for authorization header
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		throw new UnauthenticatedError("Authentication invalid");
	}

	const token = authHeader.split(" ")[1];

	try {
		const secret = process.env.JWT_SECRET || "";
		const payload = jwt.verify(token, secret) as JwtPayload;

		// Attach the user information from the JWT payload to the request object
		req.user = {
			userId: payload.userId,
			username: payload.username,
			fullName: payload.fullName,
			email: payload.email,
		};

		next();
	} catch (error) {
		throw new UnauthenticatedError("Authentication invalid");
	}
};

export default auth;
