import { Request, Response, NextFunction } from "express";
import { assignCspNonce } from "../../src/middleware/csp.nonce.middleware";


describe("Test Assign CSP Nonce", () => {
    let mockRequest: Request;
    let mockResponse: Response;
    let mockNext: NextFunction;
    const nonce = "aa512ab7-021b-aaaa-aaaa-2ffe82dfdf0b";

    beforeEach(() => {
        mockRequest = {} as Request;
        mockResponse = {
            locals: {
                cspNonce: undefined
            }
        } as unknown as Response;
        mockNext = jest.fn();
    });

    it("should trigger next if when called", () => {
        assignCspNonce(nonce)(mockRequest, mockResponse, mockNext);
        expect(mockResponse.locals.cspNonce).toEqual(nonce);
        expect(mockNext).toHaveBeenCalled();
    });
});
