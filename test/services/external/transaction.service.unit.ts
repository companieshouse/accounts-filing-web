import ApiClient from "@companieshouse/api-sdk-node/dist/client";
import Resource, { ApiErrorResponse } from "@companieshouse/api-sdk-node/dist/services/resource";
import { TransactionService as LocalTransactionService } from "../../../src/services/external/transaction.service";
import { Transaction } from "@companieshouse/api-sdk-node/dist/services/transaction/types";

jest.mock('@companieshouse/api-sdk-node/dist/client', () => {
    return jest.fn().mockImplementation(() => {
        return {
            transactionService: {
                postTransaction: jest.fn()
            }
        };
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

        service = new LocalTransactionService({
            transaction: {
                postTransaction: mockPostStatus
            }
        } as unknown as ApiClient);
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