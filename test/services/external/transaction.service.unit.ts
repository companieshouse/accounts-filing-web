import { mockApiClient } from "../../mocks/api.client.mock";

import { Session } from "@companieshouse/node-session-handler";
import { getSessionRequest } from "../../mocks/session.mock";
import { TransactionService } from "../../../src/services/external/transaction.service";
import { ContextKeys } from "../../../src/utils/constants/context.keys";
import { headers } from "../../../src/utils/constants/headers";
import { TransactionStatuses } from "../../../src/utils/constants/transaction";
import { Transaction } from "@companieshouse/api-sdk-node/dist/services/transaction/types";
import { TransactionService as LocalTransactionService } from "../../../src/services/external/transaction.service";
import { Resource } from "@companieshouse/api-sdk-node";
import { ApiErrorResponse } from "@companieshouse/api-sdk-node/dist/services/resource";
import ApiClient from "@companieshouse/api-sdk-node/dist/client";

const testCompanyNumber = "00006400";
const testAccountsFilingId = "accountsFilingId test value";
const testTransactionId = "transactionFilingId test value";

describe("Close transaction tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("Should create a public oauth api client from the sesion", async () => {
        const session = getSessionRequest();

        const transactionService = new TransactionService(session);

        expect(transactionService['session']).toEqual(session);
    });

    it("Should throw an exception if company number not present in the session", async () => {
        const session = getSessionRequest();

        const transactionService = new TransactionService(session);

        session.data.signin_info!.company_number = undefined;

        expect(transactionService.closeTransaction()).rejects.toThrow("Unable to find company number in session");
    });

    it("Should throw an exception if accounts filing id is not present in session", async () => {
        const session = getSessionRequest();

        const transactionService = new TransactionService(session);

        // Set company number so that it doesn't throw an exception
        session.data.signin_info!.company_number = "00006400";
        session.setExtraData(ContextKeys.ACCOUNTS_FILING_ID, undefined);


        expect(transactionService.closeTransaction()).rejects.toThrow("Unable to find accountsFilingId in session");
    });

    it("Should throw an exception if transaction id is not present in session", async () => {
        const session = getSessionRequest();

        const transactionService = new TransactionService(session);

        // Set company number and accounts filing id so that they doesn't throw an exception
        session.data.signin_info!.company_number = "00006400";
        session.setExtraData(ContextKeys.ACCOUNTS_FILING_ID, "accountsFilingId test value");

        session.setExtraData(ContextKeys.TRANSACTION_ID, undefined);

        expect(transactionService.closeTransaction()).rejects.toThrow("Unable to find transactionId in session");
    });

    it("Should call 'putTransaction' and return the value from the payment required header", async () => {
        const session = getSessionRequest();

        const transactionService = new TransactionService(session);

        const expectedPaymentUrl = "payment url";
        // Mock the 'putTransaction' method.
        // This test only tests the 'closeTransaction' method so it is fine to mock it.
        const apiResponse = {
            headers: {
                [headers.PAYMENT_REQUIRED]: expectedPaymentUrl
            },
        };
        transactionService.putTransaction = jest.fn().mockReturnValue(apiResponse);

        // Mock session values

        session.data.signin_info!.company_number = testCompanyNumber;
        session.setExtraData(ContextKeys.ACCOUNTS_FILING_ID, testAccountsFilingId);
        session.setExtraData(ContextKeys.TRANSACTION_ID, testTransactionId);


        const actualPaymentUrl = await transactionService.closeTransaction();

        expect(actualPaymentUrl).toBe(expectedPaymentUrl);
        expect(transactionService.putTransaction).toHaveBeenCalledTimes(1);
        expect(transactionService.putTransaction).toHaveBeenCalledWith(
            testCompanyNumber,
            testAccountsFilingId,
            testTransactionId,
            TransactionStatuses.CLOSED
        );
    });
});


describe("Put transaction tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("Should call the SDK transaction service", async () => {
        const mockReturnedTransaction: Transaction = {
            reference: "test reference",
            description: "test description"
        };

        mockApiClient.transaction.putTransaction.mockResolvedValue({
            httpStatusCode: 200,
            resource: mockReturnedTransaction
        });

        // Since we have mocked the createPublicOAuthApiClient function we can pass an empty session in
        const transactionService = new TransactionService({} as Session);

        const resp = await transactionService.putTransaction(testCompanyNumber, testAccountsFilingId, testTransactionId, TransactionStatuses.CLOSED);

        expect(mockApiClient.transaction.putTransaction).toHaveBeenCalledTimes(1);
        expect(resp.resource).toEqual(mockReturnedTransaction);
    });

    it("Should throw an error if the return status is greater than or equal to 400", async () => {
        mockApiClient.transaction.putTransaction.mockResolvedValue({
            httpStatusCode: 400
        });

        // Since we have mocked the createPublicOAuthApiClient function we can pass an empty session in
        const transactionService = new TransactionService({} as Session);

        expect(transactionService.putTransaction(testCompanyNumber, testAccountsFilingId, testTransactionId, TransactionStatuses.CLOSED))
            .rejects.toThrow("Http status code 400");
    });

    it("Should throw an error if there is no return value", async () => {
        mockApiClient.transaction.putTransaction.mockResolvedValue(undefined);

        // Since we have mocked the createPublicOAuthApiClient function we can pass an empty session in
        const transactionService = new TransactionService({} as Session);

        expect(transactionService.putTransaction(testCompanyNumber, testAccountsFilingId, testTransactionId, TransactionStatuses.CLOSED))
            .rejects.toThrow("Transaction API PUT request returned no response for transaction id");
    });
});

function createApiResponse(
    companyNumber: string,
    reference: string,
    description: string
    ) {
    return {
        id: "0",
        etag: "0",
        links: {
            self: "/link",
        },
        reference,
        status: "open",
        kind: "transaction",
        companyName: undefined,
        companyNumber,
        createdAt: "2000-01-01T13:00:00Z",
        createdBy: {
            language: "en",
            id: "0",
            email: "email",
        },
        updatedAt: "2000-01-01T13:00:00Z",
        description,
        resources: undefined,
    };
}

describe('TransactionService', () => {
    const companyNumber = "0";
    const reference = "accounts-filing-web";
    const description = "accounts filing web";

    let service: LocalTransactionService;
    const mockPostStatus = jest.fn<Promise<Resource<Transaction> | ApiErrorResponse>, [Transaction]>();

    beforeEach(() => {
        jest.resetAllMocks();

        service = new LocalTransactionService({} as Session);
        mockApiClient.transaction.postTransaction = mockPostStatus;
    });

    it("should response when http code is 201", async () => {
        const resource = createApiResponse(companyNumber, reference, description);
        const mockResponse = { httpStatusCode: 201, resource }
        mockPostStatus.mockResolvedValue(mockResponse);

        await expect(service.postTransactionRecord(companyNumber, reference, description)).resolves.toEqual(resource);
    });

    it("should throw error response when http code is 418", async () => {
        const resource = createApiResponse(companyNumber, reference, description);
        const mockErrorResponse = { httpStatusCode: 418, errors: [{ error: 'Some error occurred' }] };
        mockPostStatus.mockResolvedValue(mockErrorResponse);

        await expect(service.postTransactionRecord(companyNumber, reference, description)).rejects.toEqual(mockErrorResponse);
    })

    it("should throw error when resource is undefined", async () => {
        const resource = undefined;
        const mockResponse = { httpStatusCode: 201, errors: [{ error: 'Some error occurred' }] }
        mockPostStatus.mockResolvedValue(mockResponse);

        await expect(service.postTransactionRecord(companyNumber, reference, description)).rejects.toEqual(Error("Transaction service didn't return a resource"));
    })

    it("should throw error when resource obtains a undefined", async () => {
        const resource = undefined;
        const mockResponse = { httpStatusCode: 201, resource: undefined}
        mockPostStatus.mockResolvedValue(mockResponse);

        await expect(service.postTransactionRecord(companyNumber, reference, description)).rejects.toEqual(Error("Transaction service return resource contains a undefined or null"));
    })
});
