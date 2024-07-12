import { LanguageNames, LocalesService, i18nCh } from "@companieshouse/ch-node-utils";
import { env } from "../config";
import { Request } from "express";

export enum Language {
    CY = "cy",
    EN = "en"
}

export const selectLang = (lang: Language): Language => {
    switch (lang) {
            case Language.CY:
                return Language.CY;
            case Language.EN:
            default:
                return Language.EN;
    }
};

export const addLangToUrl = (url: string, lang: string | undefined): string => {
    if (lang === undefined || lang === "") {
        return url;
    }
    if (url.includes("?")) {
        return url + "&lang=" + lang.toLowerCase();
    } else {
        return url + "?lang=" + lang.toLowerCase();
    }
};

export const getLocaleInfo = (locales: LocalesService, lang: Language) => {
    return {
        languageEnabled: locales.enabled,
        languages: LanguageNames.sourceLocales(locales.localesFolder),
        i18n: locales.i18nCh.resolveNamespacesKeys(lang),
        lang
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

