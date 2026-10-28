import { NextFunction, Request, Response } from "express";
import { logger } from "../../../utils/logger";
import { PrefixedUrls } from "../../../utils/constants/urls";
import { addLangToUrl, getLanguageFromRequest } from "../../../utils/localise";

/**
 * This handler catches any other error thrown within the application.
 * Use this error handler by calling next(e) from within a controller
 * Always keep this as the last handler in the chain for it to work.
 *
 * A factory wraps the handler to allow environment to be dependency-injected for testing
 */
export const errorHandlerFactory = (environment = process.env.NODE_ENV) => {
    return (
        err: unknown,
        req: Request,
        res: Response,
        _next: NextFunction
    ) => {
        if (environment === "test") {
            // logger does not work in certain jest testing contexts (middleware, 404, etc), directly using console.log to bypass as much time has been lost to missing error messages
            console.error(err);
        }
        let errorDetail: string;
        if (err instanceof Error) {
            errorDetail = err.stack ?? `${err.name}: ${err.message}`;
        } else if (typeof err === "object" && err !== null) {
            // Exclude response payloads, headers and errorValues from SDK diagnostics.
            errorDetail = JSON.stringify({
                httpStatusCode: "httpStatusCode" in err && typeof err.httpStatusCode === "number" ? err.httpStatusCode : undefined,
                message: "message" in err && typeof err.message === "string" ? err.message : undefined,
                errors: "errors" in err && Array.isArray(err.errors)
                    ? err.errors.filter((error: unknown): error is Record<string, unknown> =>
                        typeof error === "object" && error !== null
                    ).map(error => ({
                        error: typeof error.error === "string" ? error.error : undefined,
                        type: typeof error.type === "string" ? error.type : undefined
                    }))
                    : undefined
            });
        } else {
            errorDetail = String(err);
        }
        logger.errorRequest(
            req,
            `An error has occurred. Re-routing to the error screen - ${errorDetail}`
        );

        let statusCode = 500;
        if (typeof err === "object" && err !== null) {
            if ("httpStatusCode" in err && err.httpStatusCode === 503) {
                statusCode = 503;
            }
        }
        if (statusCode === 503) {
            const backURL = addLangToUrl(PrefixedUrls.UPLOAD, getLanguageFromRequest(req));
            res.status(503).render("partials/error_503", { backURL });
            return;
        }
        res.status(500).render("partials/error_500");
    };
};
