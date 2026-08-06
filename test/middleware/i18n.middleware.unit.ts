import { Request, Response, NextFunction } from "express";
import { i18nMiddleware } from "../../src/middleware/i18n.middleware";

jest.mock("../../src/utils/localise", () => ({
    getLocaleInfo: jest.fn((req) => ({
        languageEnabled: true,
        currentUrl: req.originalUrl || "/",
        languages: ["en", "cy"],
        i18n: { key: "value" },
        lang: req.lang || "en"
    }))
}));

describe("i18n Middleware test", () => {
    let mockRequest: Request;
    let mockResponse: Response;
    let mockNext: NextFunction;

    beforeEach(() => {
        mockRequest = {
            originalUrl: "/test-url",
            lang: "en"
        } as unknown as Request;

        mockResponse = {
            locals: {}
        } as unknown as Response;

        mockNext = jest.fn();
    });

    it("should assign locale info to response locals", () => {
        i18nMiddleware(mockRequest, mockResponse, mockNext);

        expect(mockResponse.locals.languageEnabled).toBe(true);
        expect(mockResponse.locals.currentUrl).toBe("/test-url");
        expect(mockResponse.locals.languages).toEqual(["en", "cy"]);
        expect(mockResponse.locals.lang).toBe("en");
        expect(mockNext).toHaveBeenCalledTimes(1);
    });

    it("should call next function", () => {
        i18nMiddleware(mockRequest, mockResponse, mockNext);

        expect(mockNext).toHaveBeenCalled();
    });
});
