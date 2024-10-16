import type { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

interface CustomError extends Error {
	status?: string;
	statusCode?: number;
	isPredictable?: boolean;
}

export const devErr = (
	err: CustomError,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (req.originalUrl.startsWith("/api")) {
		return res
			.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
			.json({
				status: err.status || "error",
				error: err,
				message: err.message,
				stack: err.stack,
			});
	}
	next();
};

export const prodErr = (
	err: CustomError,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (req.originalUrl.startsWith("/api")) {
		// Predicted error. Send descriptive message to the client
		if (err.isPredictable) {
			return res
				.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
				.json({
					status: err.status || "error",
					message: err.message,
				});
		}
		// Unpredicted error, generic message
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			status: "error",
			message: "Something went very wrong!",
		});
	}
	next();
};
