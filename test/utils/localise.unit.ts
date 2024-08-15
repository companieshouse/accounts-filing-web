import { Language, addLangToUrl, getLocalesField, selectLang, addEncodeURILangToUrl } from "../../src/utils/localise";
import { i18nCh } from "@companieshouse/ch-node-utils";
import { Request } from "express";


jest.mock("@companieshouse/ch-node-utils", () => ({
    i18nCh: {
        getInstance: jest.fn().mockReturnValue({
            resolveSingleKey: jest.fn()
        })
    },
    LocalesService: {
        getInstance: jest.fn().mockReturnValue({
            localesFolder: "mocked/locales/folder"
        })
    }
}));

jest.mock("../../src/config", () => ({
    env: {
        LOCALES_PATH: "mocked/path",
        LOCALES_ENABLED: true
    }
}));

describe("Test localise", () => {
    test("Test addLangToUrl with url without queries and lang set", async () => {
        const URL = "test.test.url";
        const LANG = "lang";
        const RESULT = URL + "?lang=" + LANG;
        expect(addLangToUrl(URL, LANG)).toBe(RESULT);
    });
    test("Test addLangToUrl with url with queries and lang set", async () => {
        const URL = "test.test.url?foo=bar";
        const LANG = "lang";
        const RESULT = URL + "&lang=" + LANG;
        expect(addLangToUrl(URL, LANG)).toBe(RESULT);
    });
    test("Test addLangToUrl with url without queries and uppercase lang set", async () => {
        const URL = "test.test.url";
        const LANG = "LANG";
        const RESULT = URL + "?lang=" + LANG.toLowerCase();
        expect(addLangToUrl(URL, LANG)).toBe(RESULT);
    });
    test("Test addLangToUrl with url with queries and uppercase lang set", async () => {
        const URL = "test.test.url?foo=bar";
        const LANG = "LANG";
        const RESULT = URL + "&lang=" + LANG.toLowerCase();
        expect(addLangToUrl(URL, LANG)).toBe(RESULT);
    });
    test("Test addLangToUrl with url without queries and no lang set", async () => {
        const URL = "test.test.url";
        expect(addLangToUrl(URL, "")).toBe(URL);
    });

    test("Test addEncodeURILangToUrl with url without queries and lang set", async () => {
        const URL = "test.test.url";
        const LANG = "lang";
        const RESULT = URL + "?lang=" + LANG;
        expect(addEncodeURILangToUrl(URL, LANG)).toBe(RESULT);
    });
    test("Test addEncodeURILangToUrl with url with queries and lang set", async () => {
        const URL = "test.test.url?foo=bar";
        const LANG = "lang";
        const RESULT = URL + encodeURIComponent("&lang=") + LANG;
        expect(addEncodeURILangToUrl(URL, LANG)).toBe(RESULT);
    });
    test("Test addEncodeURILangToUrl with url without queries and uppercase lang set", async () => {
        const URL = "test.test.url";
        const LANG = "LANG";
        const RESULT = URL + "?lang=" + LANG.toLowerCase();
        expect(addEncodeURILangToUrl(URL, LANG)).toBe(RESULT);
    });
    test("Test addEncodeURILangToUrl with url with queries and uppercase lang set", async () => {
        const URL = "test.test.url?foo=bar";
        const LANG = "LANG";
        const RESULT = URL + encodeURIComponent("&lang=") + LANG.toLowerCase();
        expect(addEncodeURILangToUrl(URL, LANG)).toBe(RESULT);
    });
    test("Test addEncodeURILangToUrl with url without queries and no lang set", async () => {
        const URL = "test.test.url";
        expect(addEncodeURILangToUrl(URL, undefined)).toBe(URL);
    });
});

describe("getLocalesField", () => {
    let req: Partial<Request>;
    const fieldName = "testField";
    const mockResolveSingleKey = jest.fn();
    const MOCKED_VAL = "mockedValue";

    beforeEach(() => {
        req = {
            query: {},
            session: {
                getExtraData: jest.fn()
            } as any
        };
        (i18nCh.getInstance().resolveSingleKey as jest.Mock) = mockResolveSingleKey;
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it("should return the resolved key using query language if provided", () => {
        req.query!.lang = "cy";
        mockResolveSingleKey.mockReturnValue(MOCKED_VAL);

        const result = getLocalesField(fieldName, req as Request);

        expect(selectLang(req.query!.lang as Language)).toBe(Language.CY);
        expect(i18nCh.getInstance().resolveSingleKey).toHaveBeenCalledWith(fieldName, Language.CY);
        expect(result).toBe(MOCKED_VAL);
    });

    it("should return the resolved key using session language if query language is not provided", () => {
        req.session!.getExtraData = jest.fn().mockReturnValue(Language.EN);
        mockResolveSingleKey.mockReturnValue(MOCKED_VAL);

        const result = getLocalesField(fieldName, req as Request);

        expect(req.session!.getExtraData).toHaveBeenCalledWith("lang");
        expect(i18nCh.getInstance().resolveSingleKey).toHaveBeenCalledWith(fieldName, Language.EN);
        expect(result).toBe(MOCKED_VAL);
    });

    it("should throw an error if something goes wrong", () => {
        req.query!.lang = "en";
        const errorMessage = "Test Error";
        mockResolveSingleKey.mockImplementation(() => {
            throw new Error(errorMessage);
        });

        expect(() => getLocalesField(fieldName, req as Request)).toThrow;
    });

    it("should return the default language if session language is not available", () => {
        req.session!.getExtraData = jest.fn().mockReturnValue(undefined);
        mockResolveSingleKey.mockReturnValue(MOCKED_VAL);

        const result = getLocalesField(fieldName, req as Request);

        expect(req.session!.getExtraData).toHaveBeenCalledWith("lang");
        expect(i18nCh.getInstance().resolveSingleKey).toHaveBeenCalledWith(fieldName, Language.EN);
        expect(result).toBe(MOCKED_VAL);
    });
});
