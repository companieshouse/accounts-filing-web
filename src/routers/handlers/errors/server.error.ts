import { NextFunction, Request, Response } from "express";
import { logger } from "../../../utils/logger";

/**
 * This handler catches any other error thrown within the application.
 * Use this error handler by calling next(e) from within a controller
 * Always keep this as the last handler in the chain for it to work.
 */
export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    logger.errorRequest(
        req,
        `An error has occurred. Re-routing to the error screen - ${err.stack}`
    );
    res.status(500).render("partials/error_500");
};
