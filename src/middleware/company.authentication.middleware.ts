import { NextFunction, Request, Response } from "express";
import { authMiddleware, AuthOptions } from "@companieshouse/web-security-node";
import { env } from "../config";
import { checkCompanyNumberFormatIsValidate, isBranchRegistrationNumber } from "../utils/format/company.number.format";
import { getCompanyNumberFromExtraData } from "../utils/session";
import { addLangToUrl, getLanguageFromRequest } from "../utils/localise";
import { PrefixedUrls } from "../utils/constants/urls";

export const companyAuthenticationMiddleware = (req: Request, res: Response, next: NextFunction) => {

    const companyNumber = getCompanyNumberFromExtraData(req.session);

    checkCompanyNumberFormatIsValidate(companyNumber);

    if (env.FEATURE_FLAG_BR_COMPANY_STOP_SCREEN && isBranchRegistrationNumber(companyNumber)) {
        return res.redirect(addLangToUrl(PrefixedUrls.CANNOT_FILE_FULL_ACCOUNTS_FOR_COMPANY_TYPE, getLanguageFromRequest(req)));
    }

    const authMiddlewareConfig: AuthOptions = {
        chsWebUrl: env.CHS_URL,
        returnUrl: req.originalUrl,
        companyNumber: companyNumber
    };

    return authMiddleware(authMiddlewareConfig)(req, res, next);
};
