import { NextFunction, Router, Request, Response } from "express";
import { logger } from "../utils/logger";
import { COMPANY_LOOKUP } from "../utils/constants/urls";
import { handleExceptions } from "../utils/error.handler";
import { addEncodeURILangToUrl, selectLang } from "../utils/localise";
import { getCompanyNumber, must } from "../utils/session";
import { Urls } from "../utils/constants/urls";

const router: Router = Router();

router.get("/", handleExceptions(async (req: Request, res: Response, _next: NextFunction) => {
    let companyNumber;

    try {
        companyNumber = must(getCompanyNumber(req.session));
    } catch (error) {
        logger.info("Setting companyNumber to an empty string");
        companyNumber = "";
    }

    logger.info("Get request for serving company filing name/number entry page");
    const redirectURL = companyNumber === "" ? addEncodeURILangToUrl(COMPANY_LOOKUP, selectLang(req.query.lang)) : Urls.CHOOSE_YOUR_ACCOUNTS_PACKAGE;
    return res.redirect(redirectURL);

}));

export default router;
