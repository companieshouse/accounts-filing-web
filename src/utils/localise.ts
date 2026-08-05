import { LanguageNames, LocalesService, i18nCh } from "@companieshouse/ch-node-utils";
import { env } from "../config";
import { Request } from "express";

export enum Language {
    CY = "cy",
    EN = "en"
}

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
        if (encodeURI){
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

export const getLocaleInfo = ( req: Request) => {
    const localesService = getLocalesService();
    return {
        languageEnabled: localesService.enabled,
        currentUrl: req.originalUrl,
        languages: LanguageNames.sourceLocales(localesService.localesFolder),
        i18n: localesService.i18nCh.resolveNamespacesKeys(req.lang as Language),
        lang: req.lang
    };
};

export const getLocalesService = () => LocalesService.getInstance(env.LOCALES_PATH, env.LOCALES_ENABLED);

export function getLocalesField(fieldName: string, req: Request): string {
    const QUERY_LANG = "lang";

    try {
        const language = req.query.lang ? selectLang(req.query.lang as Language) : selectLang(req.session?.getExtraData<string>(QUERY_LANG) as Language);
        const localesPath = getLocalesService().localesFolder;
        const locales = i18nCh.getInstance(localesPath);
        return locales.resolveSingleKey(fieldName, language as string);
    } catch (e){
        throw new Error(`Unable to get locales file with ${fieldName}: ${e}`);
    }

}

