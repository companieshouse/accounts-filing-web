import { NextFunction, Request, Response } from "express";
import { PrefixedUrls } from "../utils/constants/urls";
import { checkCompanyNumberFormatIsValid } from "../utils/format/company.number.format";
import { addLangToUrl, getLanguageFromRequest } from "../utils/localise";
import { getCompanyNumberFromExtraData } from "../utils/session";
import { shouldProgressToStopScreen } from "../utils/validate/validate.company.number";

export const companyNumberValidMiddleware = (req: Request, res: Response, next: NextFunction) => {

    const companyNumber = getCompanyNumberFromExtraData(req.session);

    checkCompanyNumberFormatIsValid(companyNumber);

    if (shouldProgressToStopScreen(companyNumber)) {
        return res.redirect(addLangToUrl(PrefixedUrls.CANNOT_FILE_PACKAGE_ACCOUNTS_FOR_COMPANY_TYPE, getLanguageFromRequest(req)));
    }

    next();
};
