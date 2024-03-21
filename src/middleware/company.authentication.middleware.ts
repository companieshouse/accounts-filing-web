import { NextFunction, Request, Response } from "express";
import { authMiddleware, AuthOptions } from "@companieshouse/web-security-node";
import { env } from "../config";
import { CompanyAuthenticationHelper } from "../utils/middleware/helper/company.authentication.helper";
import { ValidateCompanyNumberFormat } from "../utils/validate/validate.company.number";
import { logger } from "../utils/logger";

export const companyAuthenticationMiddleware = (req: Request, res: Response, next: NextFunction) => {

    const companyNumber = CompanyAuthenticationHelper.getCompanyNumberFromRequest(req);

    if (!ValidateCompanyNumberFormat.isValid(companyNumber)){
        logger.errorRequest(
            req,
            `Invalid company number format entered ${companyNumber}`
        );
        res.status(500).render("partials/error_500");
    }

    const authMiddlewareConfig: AuthOptions = {
        chsWebUrl: env.CHS_URL,
        returnUrl: req.originalUrl,
        companyNumber: companyNumber
    };

    return authMiddleware(authMiddlewareConfig)(req, res, next);
};
