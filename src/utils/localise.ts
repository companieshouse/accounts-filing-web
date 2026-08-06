import { LanguageNames, LocalesService, i18nCh } from "@companieshouse/ch-node-utils";
import { env } from "../config";
import { Request } from "express";

export enum Language {
    CY = "cy",
    EN = "en"
}

export const getLanguageFromRequest = (req: Request): Language => {
    return  req.query.lang ? selectLang(req.query.lang as Language) : selectLang(req.session?.getLanguage() as Language);
};

export const selectLang = (lang: any): Language => {
    switch (lang) {
            case Language.CY:
                return Language.CY;
            case Language.EN:
            default:
                return Language.EN;
    }
};

const createUrlWithLang = (url: string, lang: string | undefined, encodeURI: boolean = false): string => {
    let urlWithLang: string;
    if (lang === undefined || lang === "") {
        return url;
    }
    if (url.includes("?")) {
        if (encodeURI) {
            urlWithLang = url + encodeURIComponent("&lang=") + lang.toLowerCase();
        } else {
            urlWithLang = url + "&lang=" + lang.toLowerCase();
        }
    } else {
        urlWithLang = url + "?lang=" + lang.toLowerCase();
    }
    return urlWithLang;
};

export const addLangToUrl = (url: string, lang: string): string => {
    return createUrlWithLang(url, lang);
};

export const addEncodeURILangToUrl = (url: string, lang: string | undefined): string => {
    return createUrlWithLang(url, lang, true);
};

export const getLocaleInfo = (req: Request) => {
    const localesService = getLocalesService();
    return {
        languageEnabled: localesService.enabled, // used by locales-banner.njk when enabled language selector is visible.
        currentUrl: req.originalUrl, // used by locales-banner.njk as self-url to allow language selector buttons to work.
        languages: LanguageNames.sourceLocales(localesService.localesFolder), // used by locales-banner.njk is a list of supported languages.
        i18n: localesService.i18nCh.resolveNamespacesKeys(req.lang as Language), // resolves translation keys and their localized values for the current language.
        lang: req.lang // utility variable that holds the current language code to be used in templates.
    };
};

export const getLocalesService = () => LocalesService.getInstance(env.LOCALES_PATH, env.LOCALES_ENABLED);

export function getLocalesField(fieldName: string, req: Request): string {
    try {
        const language = getLanguageFromRequest(req);
        const localesPath = getLocalesService().localesFolder;
        const locales = i18nCh.getInstance(localesPath);
        return locales.resolveSingleKey(fieldName, language as string);
    } catch (e) {
        throw new Error(`Unable to get locales file with ${fieldName}: ${e}`);
    }

}

