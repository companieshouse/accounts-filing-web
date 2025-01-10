import { Request, Response } from "express";
import { UploadedHandler } from "../../../../src/routers/handlers/uploaded/uploaded";
import { getAccountsFilingId, getPackageType, getTransactionId, getCompanyNumber, getUserEmail } from "../../../../src/utils/session";
import { mockAccountsFilingService } from "../../../mocks/accounts.filing.service.mock";
import { AccountValidatorResponse } from "@companieshouse/api-sdk-node/dist/services/account-validator/types";
import { jest } from "@jest/globals";
import { mockSession } from "../../../mocks/session.middleware.mock";
import { getSessionRequest } from "../../../mocks/session.mock";

jest.mock("../../../../src/utils/session", () => ({
    getAccountsFilingId: jest.fn(),
    getPackageType: jest.fn(),
    getTransactionId: jest.fn(),
    getCompanyNumber: jest.fn(),
    getUserEmail: jest.fn(),
    must: jest.fn(),
    setValidationResult: jest.fn()
}));

describe("UploadedHandler - session key error checks", () => {
    let handler: UploadedHandler;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;

    beforeEach(() => {
        jest.clearAllMocks();

        handler = new UploadedHandler(mockAccountsFilingService);

        Object.assign(mockSession, getSessionRequest());

        mockSession.data.signin_info!.company_number = "13564414";
        mockSession.data.signin_info!.signed_in = 1;
        mockSession.data.signin_info!.user_profile!.email = "test@test";

        mockRequest = {
            session: {
                ...mockSession,
                getExtraData: jest.fn(),
                setExtraData: jest.fn()
            } as any,
            params: { fileId: "bffebd2c-3848-43d2-a37a-78a93983ff52" },

            get: jest.fn().mockImplementation((headerName: string) => {
                if (headerName === "host") {return "chs.local";}
                return undefined;
            }),
        };
        mockResponse = {};
        (getCompanyNumber as jest.MockedFunction<typeof getCompanyNumber>).mockReturnValue("13564414");
    });

    it("should throw an error if packageType is an instance of Error", async () => {

        (getPackageType as jest.MockedFunction<typeof getPackageType>).mockReturnValue(new Error("Invalid package type"));
        (getTransactionId as jest.MockedFunction<typeof getTransactionId>).mockReturnValue("valid-transaction-id");
        (getAccountsFilingId as jest.MockedFunction<typeof getAccountsFilingId>).mockReturnValue("valid-accounts-filing-id");
        (getUserEmail as jest.MockedFunction<typeof getUserEmail>).mockReturnValue("test");

        await expect(handler.executeGet(mockRequest as Request, mockResponse as Response)).rejects.toThrow("Invalid package type");
    });

    it("should throw an error if transactionId is an instance of Error", async () => {

        (getPackageType as jest.MockedFunction<typeof getPackageType>).mockReturnValue("uksef");
        (getTransactionId as jest.MockedFunction<typeof getTransactionId>).mockReturnValue(new Error("Invalid transaction ID"));
        (getAccountsFilingId as jest.MockedFunction<typeof getAccountsFilingId>).mockReturnValue("valid-accounts-filing-id");
        (getUserEmail as jest.MockedFunction<typeof getUserEmail>).mockReturnValue("test");

        await expect(handler.executeGet(mockRequest as Request, mockResponse as Response)).rejects.toThrow("Invalid transaction ID");
    });

    it("should throw an error if accountsFilingId is an instance of Error", async () => {

        (getPackageType as jest.MockedFunction<typeof getPackageType>).mockReturnValue("uksef");
        (getTransactionId as jest.MockedFunction<typeof getTransactionId>).mockReturnValue("valid-transaction-id");
        (getAccountsFilingId as jest.MockedFunction<typeof getAccountsFilingId>).mockReturnValue(new Error("Invalid accounts filing ID"));
        (getUserEmail as jest.MockedFunction<typeof getUserEmail>).mockReturnValue("test");

        await expect(handler.executeGet(mockRequest as Request, mockResponse as Response)).rejects.toThrow("Invalid accounts filing ID");
    });

    it("should throw an error if email is an instance of Error", async () => {

        (getPackageType as jest.MockedFunction<typeof getPackageType>).mockReturnValue("uksef");
        (getTransactionId as jest.MockedFunction<typeof getTransactionId>).mockReturnValue("valid-transaction-id");
        (getAccountsFilingId as jest.MockedFunction<typeof getAccountsFilingId>).mockReturnValue("valid-accounts-filing-id");
        (getUserEmail as jest.MockedFunction<typeof getUserEmail>).mockReturnValue(new Error("Invalid email"));

        await expect(handler.executeGet(mockRequest as Request, mockResponse as Response)).rejects.toThrow("Invalid email");
    });

    it("should proceed without error if all session values are valid", async () => {

        (getPackageType as jest.MockedFunction<typeof getPackageType>).mockReturnValue("limited-partnership");
        (getTransactionId as jest.MockedFunction<typeof getTransactionId>).mockReturnValue("valid-transaction-id");
        (getAccountsFilingId as jest.MockedFunction<typeof getAccountsFilingId>).mockReturnValue("valid-accounts-filing-id");
        (getUserEmail as jest.MockedFunction<typeof getUserEmail>).mockReturnValue("test");

        const mockValidationResult: Promise<{ resource: AccountValidatorResponse; httpStatusCode: number }> = Promise.resolve({
            resource: {
                status: "complete",
                result: {
                    errorMessages: [],
                },
                fileId: "bffebd2c-3848-43d2-a37a-78a93983ff52",
                fileName: "mock-file-name"
            },
            httpStatusCode: 200,
        });
        mockAccountsFilingService.getValidationStatus = jest.fn().mockReturnValue(mockValidationResult);

        const result = await handler.executeGet(mockRequest as Request, mockResponse as Response);
        expect(result).toBeDefined();
        expect(result.result).toBeDefined();
        expect(JSON.stringify(result.errors)).toBe('{}');
    });
});
