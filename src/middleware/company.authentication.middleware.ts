import { NextFunction, Request, Response } from "express";
import { authMiddleware, AuthOptions } from "@companieshouse/web-security-node";
import { URL_QUERY_PARAM } from "../utils/constants/urls";
import { env } from "../config";

export const companyAuthenticationMiddleware = (req: Request, res: Response, next: NextFunction) => {

    const companyNumber: string = req.params[URL_QUERY_PARAM.PARAM_COMPANY_NUMBER];

    const authMiddlewareConfig: AuthOptions = {
        chsWebUrl: env.CHS_URL,
        returnUrl: req.originalUrl,
        companyNumber: "CN12345"
    };

    return authMiddleware(authMiddlewareConfig)(req, res, next);
};
