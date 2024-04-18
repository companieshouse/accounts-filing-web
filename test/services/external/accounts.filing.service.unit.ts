import PrivateApiClient from 'private-api-sdk-node/dist/client';
import { AccountsFilingService } from '../../../src/services/external/accounts.filing.service';
import { Resource } from '@companieshouse/api-sdk-node';
import { AccountsFileValidationResponse, AccountsFilingCompanyResponse, AccountsFilingValidationRequest, PackageAccountsType } from 'private-api-sdk-node/dist/services/accounts-filing/types';
import { ApiErrorResponse } from '@companieshouse/api-sdk-node/dist/services/resource';
import { Failure, Result, Success } from '@companieshouse/api-sdk-node/dist/services/result';
import { Session } from '@companieshouse/node-session-handler';
import { ContextKeys } from '../../../src/utils/constants/context.keys';

jest.mock('private-api-sdk-node/dist/client', () => {
    return jest.fn().mockImplementation(() => {
        return {
            accountsFilingService: {
                checkAccountsFileValidationStatus: jest.fn(),
                confirmCompany: jest.fn()
            }
        };
    });
});

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
// checkAccountsFileValidationStatus(fileValidationRequest: AccountsFilingValidationRequest): Promise<Resource<AccountsFileValidationResponse> | ApiErrorResponse>;
describe('AccountsFilingService', () => {
    let service: AccountsFilingService;
    const mockGetStatus = jest.fn<Promise<Resource<AccountsFileValidationResponse> | ApiErrorResponse>, [AccountsFilingValidationRequest]>();

    beforeEach(() => {
        jest.resetAllMocks();

        service = new AccountsFilingService({
            accountsFilingService: {
                checkAccountsFileValidationStatus: mockGetStatus
            }
        } as unknown as PrivateApiClient);
    });

    it('should successfully retrieve validation status for a valid request', async () => {
        const fileId = 'f2918b78-c344-4953-b8d1-20a6fce00267';

        const mockResponse = { httpStatusCode: 200, resource: createApiResponse(fileId) };
        mockGetStatus.mockResolvedValue(mockResponse);

        const req = { fileId, transactionId: 'some id', accountsFilingId: 'some id' };
        await expect(service.getValidationStatus(req)).resolves.toEqual(mockResponse);
    });


    it('should throw an error for non-200 response from account validator API', async () => {
        const fileId = 'f2918b78-c344-4953-b8d1-20a6fce00267';

        const mockErrorResponse = { httpStatusCode: 400, errors: [{ error: 'Some error occurred' }] };
        mockGetStatus.mockResolvedValue(mockErrorResponse);

        const req = { fileId, transactionId: 'some id', accountsFilingId: 'some id' };

        await expect(service.getValidationStatus(req)).rejects.toEqual(mockErrorResponse);
    });

});

describe('AccountsFilingService', () => {
    let service: AccountsFilingService;
    const mockMyFunction = jest.fn<Promise<Resource<AccountsFilingCompanyResponse>>, [string, string]>();

    beforeEach(() => {
        jest.resetAllMocks();

        service = new AccountsFilingService({
            accountsFilingService: {
                confirmCompany: mockMyFunction
            }
        } as unknown as PrivateApiClient);

    });

    it('should return successfully 200', async () => {

        const mockResponse = {
            httpStatusCode: 200,
            resource: {
                accountsFilingId: "65e847f791418a767a51ce5d"
            }
        };
        mockMyFunction.mockResolvedValue(mockResponse);

        const companyNumber = 'some id';
        const transactionId =  'some id';
        const companyName = 'some company';
        const companyConfirmRequest = {
            companyName
        };

        await expect(service.checkCompany(companyNumber, transactionId, companyConfirmRequest)).resolves.toEqual(mockResponse);
    });


    it('should throw an error for non-200 response', async () => {

        const mockErrorResponse = { httpStatusCode: 400, errors: [{ error: 'Some error occurred' }] };
        mockMyFunction.mockResolvedValue(mockErrorResponse);

        const companyNumber = 'some id';
        const transactionId =  'some id';
        const companyName = 'some company';
        const companyConfirmRequest = {
            companyName
        };

        await expect(service.checkCompany(companyNumber, transactionId, companyConfirmRequest)).rejects.toEqual(mockErrorResponse);
    });


    describe("AccountsFilingService.setPackageAccountsType tests", () => {
        let service: AccountsFilingService;
        const mockSetPackageAccountsType = jest.fn<Promise<Result<void, Error>>, [string, string, PackageAccountsType]>();
        let session: Session;

        const mockTransactionId = (txId: string) => {
            session.setExtraData(ContextKeys.TRANSACTION_ID, txId);
        };

        const mockaccountsFilingId = (afId: string) => {
            session.setExtraData(ContextKeys.ACCOUNTS_FILING_ID, afId);
        };

        beforeEach(() => {
            jest.resetAllMocks();

            service = new AccountsFilingService({
                accountsFilingService: {
                    setPackageAccountsType: mockSetPackageAccountsType
                }
            } as unknown as PrivateApiClient);


            session = new Session();
        });

        it("should return nothing when successful", async () => {
            mockTransactionId("tx_id");
            mockaccountsFilingId("af_id");

            mockSetPackageAccountsType.mockResolvedValue(new Success(undefined));

            const returnValue = await service.setPackageAccountsType(session, "UKSEF");

            expect(returnValue).toBeUndefined();
        });

        it("should throw an error if the transaction id is not in the session", async () => {
            expect(() => {
                return service.setPackageAccountsType(session, "UKSEF");
            }).rejects.toThrow("Unable to find transactionId in session");
        });

        it("should throw an error if the accountsFilingId  is not in the session", async () => {
            // Mock transaction ID so that it doesn
            mockTransactionId("tx_id");

            expect(() => {
                return service.setPackageAccountsType(session, "UKSEF");
            }).rejects.toThrow("Unable to find accountsFilingId in session");
        });

        it("should throw the returned error if there is any", async () => {
            mockTransactionId("tx_id");
            mockaccountsFilingId("af_id");

            mockSetPackageAccountsType.mockResolvedValue(new Failure(new Error("Some error")));

            expect(() => {
                return service.setPackageAccountsType(session, "UKSEF");
            }).rejects.toThrow("Some error");
        });
    });
});
