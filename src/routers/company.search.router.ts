import { NextFunction, Router, Request, Response } from "express";
import { logger } from "../utils/logger";
import { COMPANY_LOOKUP } from "../utils/constants/urls";
import { handleExceptions } from "../utils/error.handler";

const router: Router = Router();

router.get("/", handleExceptions(async (req: Request, res: Response, _next: NextFunction) => {
    logger.info(`Get request for serving company filing name/number entry page`);
    return res.redirect(COMPANY_LOOKUP);

}));

export default router;
