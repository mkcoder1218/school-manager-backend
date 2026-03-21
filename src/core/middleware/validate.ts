import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';

export const validateBody = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });

    if (error) {
      res.status(400).json({
        message: 'Validation error',
        details: error.details.map((detail) => detail.message),
      });
      return;
    }

    req.body = value;
    next();
  };
};
