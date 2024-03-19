import ApiClient from "@companieshouse/api-sdk-node/dist/client";
import { CompanyProfileService } from "../../../src/services/external/company.profile.service";
import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile";
import { Resource } from "@companieshouse/api-sdk-node";


jest.mock('@companieshouse/api-sdk-node/dist/client', () => {
    return jest.fn().mockImplementation(() => {
        return {
            companyProfile: {
                getCompanyProfile: jest.fn()
            }
        };
    });
});

function createApiResponse () {
    return {
        companyName: "COMPANY_NAME_???",
        companyNumber: "00000000",
        companyStatus: "active",
        dateOfCreation: "1999-12-31",
        type: "type",
        registeredOfficeAddress: {
            addressLineOne: "line one",
            addressLineTwo: "line two",
            postalCode: "ZZ78A 8OP"
        },
        accounts: {
            nextAccounts: {
                periodStartOn: "2017-01-22",
            },
            nextDue: "2019-01-22",
        }
    };
}

describe("CompanyProfileService", () => {
    let service: CompanyProfileService;
    const mockGetStatus = jest.fn<Promise<Resource<CompanyProfile>>, []>();

    beforeEach(() => {
        jest.resetAllMocks();

        service = new CompanyProfileService({
            companyProfile: {
                getCompanyProfile: mockGetStatus
            }
        } as unknown as ApiClient);
    });

    it("should successfully retrieve validation status for a valid request", async () => {
        const mockResponse = { httpStatusCode: 200, resource: createApiResponse() as unknown as CompanyProfile };
        mockGetStatus.mockResolvedValue(mockResponse);

        const result = await service.getCompanyProfile("00000000");
        expect(result).toHaveProperty("dateOfCreation", "1999-12-31");
        expect(result).toHaveProperty("companyName", "COMPANY_NAME_???");
        expect(result).toHaveProperty("companyNumber", "00000000");
        expect(result).toHaveProperty("companyStatus", "active");
        expect(result).toHaveProperty("registeredOfficeAddress.addressLineOne", "line one");
        expect(result).toHaveProperty("registeredOfficeAddress.addressLineTwo", "line two");
        expect(result).toHaveProperty("registeredOfficeAddress.postalCode", "ZZ78A 8OP");
        expect(result).toHaveProperty("accounts.nextAccounts.periodStartOn", "2017-01-22");
        expect(result).toHaveProperty("accounts.nextDue", "2019-01-22");
    });

    it("should throw an error if http code is not 200", async () => {
        const mockResponse = { httpStatusCode: 418, resource: createApiResponse() as unknown as CompanyProfile };
        mockGetStatus.mockResolvedValue(mockResponse);

        await expect(service.getCompanyProfile("00000000")).rejects.toThrow("Unable to process requested company number");
    });

    it("should throw an error if resource is undefined", async () => {
        const mockResponse = { httpStatusCode: 200, resource: undefined };
        mockGetStatus.mockResolvedValue(mockResponse);

        await expect(service.getCompanyProfile("00000000")).rejects.toThrow("Unable to process requested company number");
    });
});
