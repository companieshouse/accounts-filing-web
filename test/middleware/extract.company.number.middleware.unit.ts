import { Request, Response, NextFunction } from "express";
import { extractCompanyNumberMiddleware } from "../../src/middleware/extract.company.number.middleware";
import { checkCompanyNumberFormatIsValidate } from "../../src/utils/format/company.number.format";
import { Session } from "@companieshouse/node-session-handler";
import { ContextKeys } from "../../src/utils/constants/context.keys";

jest.mock("../../src/utils/format/company.number.format", () => ({
    checkCompanyNumberFormatIsValidate: jest.fn(),
}));

const mockSession = {
    setExtraData: jest.fn(),
    getExtraData: jest.fn(),
    deleteExtraData: jest.fn(),
    get: jest.fn(),
    data: {},
} as Partial<Session>;

describe("extractCompanyNumberMiddleware", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: jest.Mock<NextFunction>;

    beforeEach(() => {
        req = {
            params: {},
            session: mockSession,
        };
        res = {};
        next = jest.fn();
        jest.clearAllMocks();
    });

    it("should validate and set companyNumber in session when companyNumber is present and valid", () => {
        req.params = { companyNumber: "12345678" };

        (checkCompanyNumberFormatIsValidate as jest.Mock).mockImplementation(() => {});

        extractCompanyNumberMiddleware(req as Request, res as Response, next);

        expect(checkCompanyNumberFormatIsValidate).toHaveBeenCalledWith("12345678");
        expect(req.session?.setExtraData).toHaveBeenCalledWith(ContextKeys.COMPANY_NUMBER, "12345678");
        expect(next).toHaveBeenCalled();
    });

    it("should call next without setting companyNumber when companyNumber is not present", () => {
        extractCompanyNumberMiddleware(req as Request, res as Response, next);

        expect(checkCompanyNumberFormatIsValidate).not.toHaveBeenCalled();
        expect(req.session?.setExtraData).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
    });

    it("should call next without setting companyNumber when session is not present", () => {
        req.params = { companyNumber: "12345678" };
        req.session = undefined;

        (checkCompanyNumberFormatIsValidate as jest.Mock).mockImplementation(() => {});

        extractCompanyNumberMiddleware(req as Request, res as Response, next);

        expect(checkCompanyNumberFormatIsValidate).toHaveBeenCalledWith("12345678");
        expect(next).toHaveBeenCalled();
    });

    it("should not set companyNumber if it is not a string", () => {
        req.params = { companyNumber: 12345678 as any };

        (checkCompanyNumberFormatIsValidate as jest.Mock).mockImplementation(() => {});

        extractCompanyNumberMiddleware(req as Request, res as Response, next);

        expect(checkCompanyNumberFormatIsValidate).toHaveBeenCalledWith(12345678);
        expect(req.session?.setExtraData).not.toHaveBeenCalledWith(ContextKeys.COMPANY_NUMBER, 12345678);
        expect(next).toHaveBeenCalled();
    });
});
