import { NextFunction, Request, Response } from "express";
import { logger } from "../../../utils/logger";

/**
 * This handler catches any other error thrown within the application.
 * Use this error handler by calling next(e) from within a controller
 * Always keep this as the last handler in the chain for it to work.
 *
 * A factory wraps the handler to allow environment to be dependency-injected for testing
 */
export const errorHandlerFactory = (environment = process.env.NODE_ENV) => {
    return (
        err: Error,
        req: Request,
        res: Response,
        _next: NextFunction
    ) => {
        if (environment === "test") {
            // logger does not work in certain jest testing contexts (middleware, 404, etc), directly using console.log to bypass as much time has been lost to missing error messages
            console.error(err);
        }
        logger.errorRequest(
            req,
            `An error has occurred. Re-routing to the error screen - ${err.stack}`
        );
        res.status(500).render("partials/error_500");
    };
};
