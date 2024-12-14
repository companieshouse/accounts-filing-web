import { NextFunction, Router, Request, Response } from "express";
import { logger } from "../utils/logger";
import { COMPANY_LOOKUP, PrefixedUrls } from "../utils/constants/urls";
import { handleExceptions } from "../utils/error.handler";
import { addEncodeURILangToUrl, selectLang } from "../utils/localise";

const router: Router = Router();

router.get("/", handleExceptions(async (req: Request, res: Response, _next: NextFunction) => {
    const companyNumber = req.companyNumber;

    logger.info("Get request for serving company filing name/number entry page");
    const redirectURL = companyNumber === "" ? addEncodeURILangToUrl(COMPANY_LOOKUP, selectLang(req.query.lang)) : `${PrefixedUrls.CHOOSE_YOUR_ACCOUNTS_PACKAGE}?companyNumber=${companyNumber}`;
    return res.redirect(redirectURL);

}));

export default router;
