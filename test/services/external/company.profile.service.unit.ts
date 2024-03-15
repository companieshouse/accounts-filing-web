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
        dateOfCreation: "1000-01-01",
        type: "type",
        registeredOfficeAddress: {
            addressLineOne: "line one",
            addressLineTwo: "line two",
            careOf: undefined,
            country: undefined,
            locality: undefined,
            poBox: undefined,
            postalCode: "ZZ78A 8OP",
            premises: undefined,
            region: undefined,
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


        await expect(service.getCompanyProfile("00000000")).resolves.toEqual(
            {
                companyName: "COMPANY_NAME_???",
                companyNumber: "00000000",
                companyStatus: "active",
                dateOfCreation: "31 December 999",
                type: "type",
                address: {
                    "addressLineOne": "line one",
                    "addressLineTwo": "line two",
                    "careOf": undefined,
                    "country": undefined,
                    "locality": undefined,
                    "poBox": undefined,
                    "postalCode": "ZZ78A 8OP",
                    "premises": undefined,
                    "region": undefined,
                },
                nextDue: "22 January 2019",
                madeUpTo: "22 January 2017"
            }
        );
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
