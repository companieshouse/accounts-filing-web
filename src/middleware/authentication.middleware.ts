import { NextFunction, Request, Response } from "express";
import { authMiddleware, AuthOptions } from "@companieshouse/web-security-node";



export const authenticationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const CHS_URL = process.env.CHS_URL;
  const authMiddlewareConfig: AuthOptions = {
    chsWebUrl: CHS_URL ?? '',
    returnUrl: req.originalUrl
  };

  return authMiddleware(authMiddlewareConfig)(req, res, next);
};