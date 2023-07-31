import { errorHandler } from "../../../../src/routers/handlers/errors/server.error";
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
        mockRequest = {};
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            render: jest.fn(),
        };
        mockNext = jest.fn();
        mockError = new Error("Test error");
    });

    it("logs error and renders the error screen", () => {
        errorHandler(mockError, mockRequest as Request, mockResponse as Response, mockNext);

        expect(logger.errorRequest).toHaveBeenCalledWith(
            mockRequest,
            `An error has occurred. Re-routing to the error screen - ${mockError.stack}`
        );
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.render).toHaveBeenCalledWith("partials/error_500");
    });

});
