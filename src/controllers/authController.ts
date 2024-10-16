import type { Request, Response } from "express";
import User from "../models/user"; // Import the User model
import { StatusCodes } from "http-status-codes"; // Use for clean status codes

// Register user (Create account)
export const register = async (req: any, res: any): Promise<any> => {
	const { username, fullName, email, password } = req.body;

	try {
		// Check if the email or username already exists
		let user = await User.findOne({ email });
		if (user) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ message: "Email already in use" });
		}

		user = await User.findOne({ username });
		if (user) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ message: "Username already in use" });
		}

		// Create a new user
		const newUser = new User({ username, fullName, email, password });
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
