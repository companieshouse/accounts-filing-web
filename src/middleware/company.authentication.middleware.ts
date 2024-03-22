import { NextFunction, Request, Response } from "express";
import { authMiddleware, AuthOptions } from "@companieshouse/web-security-node";
import { env } from "../config";
import { CompanyAuthenticationHelper } from "../utils/middleware/helper/company.authentication.helper";
import { checkCompanyNumberFormatIsValidate } from "../utils/format/company.number.format";

export const companyAuthenticationMiddleware = (req: Request, res: Response, next: NextFunction) => {

    const companyNumber = CompanyAuthenticationHelper.getCompanyNumberFromRequest(req);

    checkCompanyNumberFormatIsValidate(companyNumber);

    const authMiddlewareConfig: AuthOptions = {
        chsWebUrl: env.CHS_URL,
        returnUrl: req.originalUrl,
        companyNumber: companyNumber
    };

    return authMiddleware(authMiddlewareConfig)(req, res, next);
};
