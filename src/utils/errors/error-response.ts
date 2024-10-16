import type { Response } from 'express';

const errorResponse = (res: Response, code: number, message: string) => {
  return res.status(code).send({
    status: false,
    message
  });
};

export default errorResponse;
