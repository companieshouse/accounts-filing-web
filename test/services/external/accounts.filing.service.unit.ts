import { mockApiClient } from '../../mocks/api.client.mock';
import { AccountsFilingService } from '../../../src/services/external/accounts.filing.service';
import { Failure, Success } from '@companieshouse/api-sdk-node/dist/services/result';
import { Session } from '@companieshouse/node-session-handler';
import { ContextKeys } from '../../../src/utils/constants/context.keys';

function createApiResponse (fileId: string) {
    return {
        fileId,
        fileName: "1mb.zip",
        status: "complete",
        result: {
            validationStatus: "FAILED",
            data: {
                balance_sheet_date: "UNKNOWN",
                accounts_type: "00",
                companieshouse_registered_number: "UNKNOWN"
            },
            errorMessages: [
                {
                    errorMessage: "Found 2 inline XBRL documents."
                },
                {
                    errorMessage: "The submission contains a malformed XML document: image1689926429N.html"
                }
            ]
        }
    };
}

describe('AccountsFilingService', () => {
    let service: AccountsFilingService;

    beforeEach(() => {
        jest.resetAllMocks();

        service = new AccountsFilingService();
    });

    it('should successfully retrieve validation status for a valid request', async () => {
        const fileId = 'f2918b78-c344-4953-b8d1-20a6fce00267';

        const mockResponse = { httpStatusCode: 200, resource: createApiResponse(fileId) };
        mockApiClient.accountsFilingService.checkAccountsFileValidationStatus.mockResolvedValue(mockResponse);

        const req = { fileId, transactionId: 'some id', accountsFilingId: 'some id' };
        await expect(service.getValidationStatus(req)).resolves.toEqual(mockResponse);
    });


    it('should throw an error for non-200 response from account validator API', async () => {
        const fileId = 'f2918b78-c344-4953-b8d1-20a6fce00267';

        const mockErrorResponse = { httpStatusCode: 400, errors: [{ error: 'Some error occurred' }] };
        mockApiClient.accountsFilingService.checkAccountsFileValidationStatus.mockResolvedValue(mockErrorResponse);

        const req = { fileId, transactionId: 'some id', accountsFilingId: 'some id' };

        await expect(service.getValidationStatus(req)).rejects.toEqual(mockErrorResponse);
    });

});

describe('AccountsFilingService', () => {
    let service: AccountsFilingService;

    beforeEach(() => {
        jest.resetAllMocks();

        service = new AccountsFilingService();
    });

    it('should return successfully 200', async () => {

        const mockResponse = {
            httpStatusCode: 200,
            resource: {
                accountsFilingId: "65e847f791418a767a51ce5d"
            }
        };

        mockApiClient.accountsFilingService.confirmCompany.mockResolvedValue(mockResponse);

        const companyNumber = 'some id';
        const transactionId =  'some id';
        const companyName = 'some company';
        const companyConfirmRequest = {
            companyName
        };

        const resp = await service.checkCompany(companyNumber, transactionId, companyConfirmRequest);
        expect(resp).toEqual(mockResponse);
    });


    it('should throw an error for non-200 response', async () => {
        const mockErrorResponse = { httpStatusCode: 400, errors: [{ error: 'Some error occurred' }] };
        mockApiClient.accountsFilingService.confirmCompany.mockResolvedValue(mockErrorResponse);

        const companyNumber = 'some id';
        const transactionId =  'some id';
        const companyName = 'some company';
        const companyConfirmRequest = {
            companyName
        };
        const resp = service.checkCompany(companyNumber, transactionId, companyConfirmRequest);
        expect(resp).rejects.toEqual(mockErrorResponse);
    });


    describe("AccountsFilingService.setPackageType tests", () => {
        let service: AccountsFilingService;
        let session: Session;

        const mockTransactionId = (txId: string) => {
            session.setExtraData(ContextKeys.TRANSACTION_ID, txId);
        };

        const mockaccountsFilingId = (afId: string) => {
            session.setExtraData(ContextKeys.ACCOUNTS_FILING_ID, afId);
        };

        beforeEach(() => {
            jest.resetAllMocks();

            service = new AccountsFilingService();


            session = new Session();
            session.setExtraData(ContextKeys.PACKAGE_TYPE, "uksef");
        });

        it("should return nothing when successful", async () => {
            mockTransactionId("tx_id");
            mockaccountsFilingId("af_id");

            mockApiClient.accountsFilingService.setPackageType.mockResolvedValue(new Success(undefined));

            const returnValue = await service.setTransactionPackageType(session);

            expect(returnValue).toBeUndefined();
        });

        it("should throw an error if the transaction id is not in the session", async () => {
            expect(() => {
                return service.setTransactionPackageType(session);
            }).rejects.toThrow("Unable to find transactionId in session");
        });

        it("should throw an error if the accountsFilingId  is not in the session", async () => {
            // Mock transaction ID so that it doesn
            mockTransactionId("tx_id");

            expect(() => {
                return service.setTransactionPackageType(session);
            }).rejects.toThrow("Unable to find accountsFilingId in session");
        });

        it("should throw the returned error if there is any", async () => {
            mockTransactionId("tx_id");
            mockaccountsFilingId("af_id");

            mockApiClient.accountsFilingService.setPackageType.mockResolvedValue(new Failure(new Error("Some error")));

            expect(() => {
                return service.setTransactionPackageType(session);
            }).rejects.toThrow("Some error");
        });
    });
});
