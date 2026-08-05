import { NextFunction, Request, Response } from "express";
import { getLocaleInfo } from "../utils/localise";


/**
 * Middleware to set i18n and currentUrl information in response locals for use in templates.
 * @param req The incoming request object
 * @param res The outgoing response object
 * @param next The next middleware function in the stack
 */
export function i18nMiddleware(req: Request, res: Response, next: NextFunction) {
    Object.assign(res.locals, getLocaleInfo(req));
    next();
}
