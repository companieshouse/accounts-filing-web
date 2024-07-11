import { NextFunction, Request, Response } from "express";
import { Language, getLocaleInfo, getLocalesService, selectLang } from "../utils/localise";

const QUERY_LANG = "lang";

// This sets the localesService and sets the key values that are required
// for the locale for each template.
export function localeMiddleware(req: Request, res: Response, next: NextFunction) {

    const session_value = req.session?.getExtraData<string>(QUERY_LANG);
    const query_value = req.query.lang;
    const lang = selectLang((query_value || session_value) as Language);
    const locales = getLocalesService();

    if (req.session) {
        req.session.setExtraData(QUERY_LANG, lang);
    }

    Object.assign(res.locals, getLocaleInfo(locales, lang as Language));
    next();
}