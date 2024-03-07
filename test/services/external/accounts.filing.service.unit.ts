import PrivateApiClient from 'private-api-sdk-node/dist/client';
import { AccountsFilingService } from '../../../src/services/external/accounts.filing.service';
import { Resource } from '@companieshouse/api-sdk-node';
import { AccountsFileValidationResponse, AccountsFilingCompanyResponse, AccountsFilingValidationRequest } from 'private-api-sdk-node/dist/services/accounts-filing/types';
import { ApiErrorResponse } from '@companieshouse/api-sdk-node/dist/services/resource';

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

// confirmCompany(companyNumber: string, transactionId: string): Promise<Resource<AccountsFilingCompanyResponse>>;
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

        await expect(service.checkCompany(companyNumber, transactionId)).resolves.toEqual(mockResponse);
    });


    it('should throw an error for non-200 response', async () => {

        const mockErrorResponse = { httpStatusCode: 400, errors: [{ error: 'Some error occurred' }] };
        mockMyFunction.mockResolvedValue(mockErrorResponse);

        const companyNumber = 'some id';
        const transactionId =  'some id';

        await expect(service.checkCompany(companyNumber, transactionId)).rejects.toEqual(mockErrorResponse);
    });

});
