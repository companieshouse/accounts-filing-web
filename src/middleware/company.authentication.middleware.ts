import { NextFunction, Request, Response } from "express";
import { authMiddleware, AuthOptions } from "@companieshouse/web-security-node";
import { CHS_URL } from "../lib/utils/properties";
import { urlParams } from "../types/page.urls";

export const companyAuthenticationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    
    if (req.originalUrl.includes("/stop-page")){
        return next();
    }

    const companyNumber: string = req.params[urlParams.PARAM_ZIP_NUMBER];

    const authMiddlewareConfig: AuthOptions = {
        chsWebUrl: CHS_URL,
        returnUrl: req.originalUrl,
        companyNumber: companyNumber
    };

    return authMiddleware(authMiddlewareConfig)(req, res, next);
}