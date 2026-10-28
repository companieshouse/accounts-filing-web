import { errorHandlerFactory } from "../../../../src/routers/handlers/errors/server.error";
import { logger } from "../../../../src/utils/logger";
import { Request, Response, NextFunction } from "express";

jest.mock("../../../../src/utils/logger", () => ({
    logger: {
        errorRequest: jest.fn(),
    }
}));

describe("errorHandler", () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: NextFunction;
    let mockError: Error;

    beforeEach(() => {
        jest.clearAllMocks();
        mockRequest = {};
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            render: jest.fn(),
        };
        mockNext = jest.fn();
        mockError = new Error("Test error");
    });

    it("logs error and renders the error screen", () => {
        errorHandlerFactory("development")(mockError, mockRequest as Request, mockResponse as Response, mockNext);

        expect(logger.errorRequest).toHaveBeenCalledWith(
            mockRequest,
            `An error has occurred. Re-routing to the error screen - ${mockError.stack}`
        );
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.render).toHaveBeenCalledWith("partials/error_500");
    });

    it("renders the 503 screen for an SDK service unavailable response", () => {
        mockRequest = { query: { lang: "en" } };
        errorHandlerFactory("development")(
            { httpStatusCode: 503 },
            mockRequest as Request, mockResponse as Response, mockNext
        );

        expect(mockResponse.status).toHaveBeenCalledWith(503);
        expect(mockResponse.render).toHaveBeenCalledWith("partials/error_503", { backURL: "/accounts-filing/upload?lang=en" });
        expect(logger.errorRequest).toHaveBeenCalled();
    });

    it("logs an Error's message when its stack is unavailable", () => {
        mockError.stack = undefined;

        errorHandlerFactory("development")(mockError, mockRequest as Request, mockResponse as Response, mockNext);

        expect(logger.errorRequest).toHaveBeenCalledWith(
            mockRequest,
            "An error has occurred. Re-routing to the error screen - Error: Test error"
        );
    });

    it.each([500, 503])("logs SDK error details before returning %s", (httpStatusCode) => {
        mockRequest = { query: { lang: "en" } };
        const error = {
            httpStatusCode,
            message: "Upstream request failed",
            errors: [{
                error: "service-unavailable",
                type: "service",
                errorValues: { email: "private@example.com" }
            }],
            resource: { email: "private@example.com" },
            headers: { authorization: "secret" }
        };
        Object.assign(error, { response: error });
        const status = jest.fn().mockImplementation(() => {
            expect(logger.errorRequest).toHaveBeenCalledWith(
                mockRequest,
                `An error has occurred. Re-routing to the error screen - ${JSON.stringify({
                    httpStatusCode,
                    message: error.message,
                    errors: [{ error: "service-unavailable", type: "service" }]
                })}`
            );
            return mockResponse;
        });
        mockResponse.status = status;

        errorHandlerFactory("development")(error, mockRequest as Request, mockResponse as Response, mockNext);

        expect(status).toHaveBeenCalledWith(httpStatusCode);
    });

    it("logs a thrown string", () => {
        errorHandlerFactory("development")("Connection failed", mockRequest as Request, mockResponse as Response, mockNext);

        expect(logger.errorRequest).toHaveBeenCalledWith(
            mockRequest,
            "An error has occurred. Re-routing to the error screen - Connection failed"
        );
    });

    it.each([null, undefined, {}, { httpStatusCode: 400 }, { httpStatusCode: 500 }])(
        "keeps the 500 screen for other errors: %p", (error) => {
            errorHandlerFactory("development")(error, mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.render).toHaveBeenCalledWith("partials/error_500");
        }
    );

});
