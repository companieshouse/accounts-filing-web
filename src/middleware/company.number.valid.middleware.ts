import { NextFunction, Request, Response } from "express";
import { env } from "../config";
import { checkCompanyNumberFormatIsValid } from "../utils/format/company.number.format";
import { getCompanyNumberFromExtraData } from "../utils/session";
import { addLangToUrl, getLanguageFromRequest } from "../utils/localise";
import { PrefixedUrls } from "../utils/constants/urls";
import { isBranchRegistrationNumber, isLPNumber, isSLPNumber } from "../utils/validate/validate.company.number";

export const companyNumberValidMiddleware = (req: Request, res: Response, next: NextFunction) => {

    const companyNumber = getCompanyNumberFromExtraData(req.session);

    checkCompanyNumberFormatIsValid(companyNumber);

    if (
        env.FEATURE_FLAG_BR_COMPANY_STOP_SCREEN_250826 && isBranchRegistrationNumber(companyNumber) ||
        !env.FEATURE_FLAG_ALLOW_LP_COMPANY_TO_USE_SERVICE_170926 && isLPNumber(companyNumber) ||
        !env.FEATURE_FLAG_ALLOW_SLP_COMPANY_TO_USE_SERVICE_170926 && isSLPNumber(companyNumber)
    ) {
        return res.redirect(addLangToUrl(PrefixedUrls.CANNOT_FILE_FULL_ACCOUNTS_FOR_COMPANY_TYPE, getLanguageFromRequest(req)));
    }

    next();
};
