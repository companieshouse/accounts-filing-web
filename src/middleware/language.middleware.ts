import { NextFunction, Request, Response } from "express";
import { getLocaleInfo } from "../utils/localise";


// This sets the localesService and sets the key values that are required
// for the locale for each template.
export function languageMiddleware(req: Request, res: Response, next: NextFunction) {
    Object.assign(res.locals, getLocaleInfo(req));
    next();
}
