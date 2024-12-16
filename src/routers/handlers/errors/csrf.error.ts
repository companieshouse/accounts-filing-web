import { NextFunction, Request, Response } from "express";
import { logger } from "../../../utils/logger";
import { CsrfError } from "@companieshouse/web-security-node";



export const csrfErrorHandler = (err: CsrfError | Error, _: Request,
                                 res: Response, next: NextFunction) => {

    // handle non-CSRF Errors immediately
    if (!(err instanceof CsrfError)) {
        next(err);
        return;
    }

    logger.error(
        `An error when validating CSRF token. Re-routing to the error screen - ${err.stack}`
    );

    return res.status(403).render(
        "partials/error_csrf", {
        }
    );
};
