import type { Request, Response } from "express";
import User from "../models/user"; // Import the User model
import { StatusCodes } from "http-status-codes"; // Use for clean status codes
import TokenBlacklist from "../models/tokenBlacklist";
import jwt from "jsonwebtoken";

// Register user (Create account)
export const register = async (req: any, res: any): Promise<any> => {
	const { fullName, email, password } = req.body;

	try {
		// Check if the email already exists
		let user = await User.findOne({ email });
		if (user) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ message: "Email already in use" });
		}

		// Create a new user
		const newUser = new User({ fullName, email, password });
		await newUser.save();

		// Generate JWT token
		const token = newUser.createJWT();

		// Send response with token
		return res
			.status(StatusCodes.CREATED)
			.json({ message: "User created successfully", token });
	} catch (error) {
		console.error(error);
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ message: "Server error" });
	}
};

// Login user
export const login = async (req: any, res: any): Promise<any> => {
	const { email, password } = req.body;

	try {
		// Check if the user exists
		const user = await User.findOne({ email });
		if (!user) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ message: "Invalid credentials" });
		}

		// Check if the password matches
		const isMatch = await user.comparePassword(password);
		if (!isMatch) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ message: "Invalid credentials" });
		}

		// Generate JWT token
		console.log(user);
		const token = user.createJWT();

		// Send response with token
		return res
			.status(StatusCodes.OK)
			.json({ message: "Login successful", token });
	} catch (error) {
		console.error(error);
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ message: "Server error" });
	}
};


export const logout = async (req: any, res: any) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Decode the token to get its expiration time
    const decoded: any = jwt.decode(token);

    if (!decoded || !decoded.exp) {
      return res.status(400).json({ message: "Invalid token" });
    }

    // Save the token in the blacklist with the expiration time
    const expiresAt = new Date(decoded.exp * 1000); // JWT exp is in seconds
    await TokenBlacklist.create({ token, expiresAt });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "Server error during logout" });
  }
};