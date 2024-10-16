// src/types/index.d.ts
import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        username: string;
        fullName: string;
        email: string;
      };
    }
  }
}

export {};
