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
