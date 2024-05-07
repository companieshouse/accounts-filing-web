import { NextFunction, Request, Response } from "express";
import { authMiddleware, AuthOptions } from "@companieshouse/web-security-node";
import { env } from "../config";
import { checkCompanyNumberFormatIsValidate } from "../utils/format/company.number.format";
import { getCompanyNumberFromExtraData } from "../utils/session";

export const companyAuthenticationMiddleware = (req: Request, res: Response, next: NextFunction) => {

    const companyNumber = getCompanyNumberFromExtraData(req.session);

    checkCompanyNumberFormatIsValidate(companyNumber);

    const authMiddlewareConfig: AuthOptions = {
        chsWebUrl: env.CHS_URL,
        returnUrl: req.originalUrl,
        companyNumber: companyNumber
    };

    return authMiddleware(authMiddlewareConfig)(req, res, next);
};
