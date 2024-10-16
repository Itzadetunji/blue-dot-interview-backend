import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message });
};
