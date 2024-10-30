import { Request, Response } from "express";
import { UploadedHandler } from "../../../../src/routers/handlers/uploaded/uploaded";
import { getAccountsFilingId, getPackageType, getTransactionId, getCompanyNumber } from "../../../../src/utils/session";
import { mockAccountsFilingService } from "../../../mocks/accounts.filing.service.mock";
import { AccountValidatorResponse } from "@companieshouse/api-sdk-node/dist/services/account-validator/types";
import { jest } from "@jest/globals";

jest.mock("../../../../src/utils/session", () => ({
    getAccountsFilingId: jest.fn(),
    getPackageType: jest.fn(),
    getTransactionId: jest.fn(),
    getCompanyNumber: jest.fn(),
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

        mockRequest = {
            session: {
                data: {
                    signin_info: {
                        company_number: "13564414",
                        signed_in: 1,
                    },
                },
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

        await expect(handler.executeGet(mockRequest as Request, mockResponse as Response)).rejects.toThrow("Invalid package type");
    });

    it("should throw an error if transactionId is an instance of Error", async () => {

        (getPackageType as jest.MockedFunction<typeof getPackageType>).mockReturnValue("uksef");
        (getTransactionId as jest.MockedFunction<typeof getTransactionId>).mockReturnValue(new Error("Invalid transaction ID"));
        (getAccountsFilingId as jest.MockedFunction<typeof getAccountsFilingId>).mockReturnValue("valid-accounts-filing-id");

        await expect(handler.executeGet(mockRequest as Request, mockResponse as Response)).rejects.toThrow("Invalid transaction ID");
    });

    it("should throw an error if accountsFilingId is an instance of Error", async () => {

        (getPackageType as jest.MockedFunction<typeof getPackageType>).mockReturnValue("uksef");
        (getTransactionId as jest.MockedFunction<typeof getTransactionId>).mockReturnValue("valid-transaction-id");
        (getAccountsFilingId as jest.MockedFunction<typeof getAccountsFilingId>).mockReturnValue(new Error("Invalid accounts filing ID"));

        await expect(handler.executeGet(mockRequest as Request, mockResponse as Response)).rejects.toThrow("Invalid accounts filing ID");
    });

    it("should proceed without error if all session values are valid", async () => {

        (getPackageType as jest.MockedFunction<typeof getPackageType>).mockReturnValue("limited-partnership");
        (getTransactionId as jest.MockedFunction<typeof getTransactionId>).mockReturnValue("valid-transaction-id");
        (getAccountsFilingId as jest.MockedFunction<typeof getAccountsFilingId>).mockReturnValue("valid-accounts-filing-id");

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
        expect(result.isReviewNeeded).toBeTruthy();
        expect(result.result).toBeDefined();
        expect(JSON.stringify(result.errors)).toBe('{}');
    });
});
