import type { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

const errorHandler = (
	err: Error,
	_: Request,
	res: Response,
	__: NextFunction
) => {
	console.error(err);
	res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message });
};

export default errorHandler;
