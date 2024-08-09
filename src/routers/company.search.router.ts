import { NextFunction, Router, Request, Response } from "express";
import { logger } from "../utils/logger";
import { COMPANY_LOOKUP } from "../utils/constants/urls";
import { handleExceptions } from "../utils/error.handler";
import { addEncodeURILangToUrl, selectLang } from "../utils/localise";

const router: Router = Router();

router.get("/", handleExceptions(async (req: Request, res: Response, _next: NextFunction) => {
    logger.info(`Get request for serving company filing name/number entry page`);
    const redirectURL = addEncodeURILangToUrl(COMPANY_LOOKUP, selectLang(req.query.lang));
    return res.redirect(redirectURL);

}));

export default router;
