import { NextFunction, Request, Response } from "express";
import { env } from "../config";
import { checkCompanyNumberFormatIsValidate, isBranchRegistrationNumber } from "../utils/format/company.number.format";
import { getCompanyNumberFromExtraData } from "../utils/session";
import { addLangToUrl, getLanguageFromRequest } from "../utils/localise";
import { PrefixedUrls } from "../utils/constants/urls";

export const companyNumberValidMiddleware = (req: Request, res: Response, next: NextFunction) => {

    const companyNumber = getCompanyNumberFromExtraData(req.session);

    checkCompanyNumberFormatIsValidate(companyNumber);

    if (env.FEATURE_FLAG_BR_COMPANY_STOP_SCREEN_250826 && isBranchRegistrationNumber(companyNumber)) {
        return res.redirect(addLangToUrl(PrefixedUrls.CANNOT_FILE_FULL_ACCOUNTS_FOR_COMPANY_TYPE, getLanguageFromRequest(req)));
    }

    next();
};
