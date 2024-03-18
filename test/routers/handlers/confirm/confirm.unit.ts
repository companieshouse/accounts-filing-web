import { Request } from "express";
import { CompanyConfirmHandler } from "../../../../src/routers/handlers/company/confirm/confirm";
import { companyProfileServiceMock } from "../../../mocks/company.profile.service.mock";
import { AccountsFilingCompanyProfile } from "../../../../src/types/confirm.company.data";
import { BaseViewData, ViewModel } from "../../../../src/routers/handlers/generic";

interface CompanyFilingIdData extends BaseViewData {
    companyProfile: AccountsFilingCompanyProfile,
    uploadLink: string,
    changeCompanyUrl: string
}

describe("CompanyConfirmHandler", () => {

    let handler: CompanyConfirmHandler;
    let mockReq: Partial<Request>;
    let mockReqMissingCompanyNumber: Partial<Request>;
    let mockReqInvalidCompanyNumber: Partial<Request>;

    beforeEach(() => {
        jest.clearAllMocks();

        handler = new CompanyConfirmHandler(companyProfileServiceMock);
        mockReq = {
            query: { companyNumber: '12345678' },
            protocol: 'http',
            get: function (s): any {
                if (s === 'host') {
                    return 'chs.local';
                }
            }
        };
        mockReqMissingCompanyNumber = {
            protocol: 'http',
            get: function (s): any {
                if (s === 'host') {
                    return 'chs.local';
                }
            }
        };
        mockReqInvalidCompanyNumber = {
            query: { companyNumber: '123456' },
            protocol: 'http',
            get: function (s): any {
                if (s === 'host') {
                    return 'chs.local';
                }
            }
        };
    });

    describe("execute method", () => {
        it("should return a valid viewData", async () => {
            companyProfileServiceMock.getCompanyProfile.mockResolvedValue(
                {} as AccountsFilingCompanyProfile
            );
            const results: ViewModel<CompanyFilingIdData> = await handler.execute(mockReq as Request, {} as any);

            const expectedCallValue = {
                errors: {},
                isSignedIn: false,
                title: 'Confirm company – Accounts Filing – GOV.UK ',
                backURL: '/accounts-filing/company-search/',
                companyProfile: {},
                uploadLink: '/accounts-filing/company/12345678/uploaded',
                changeCompanyUrl: '/company-lookup/search?forward=/accounts-filing/confirm-company?companyNumber=%7BcompanyNumber%7D',
                Urls: {
                    HOME: "/accounts-filing/",
                    HEALTHCHECK: "/accounts-filing/healthcheck",
                    UPLOAD: "/accounts-filing/upload",
                    UPLOADED: "/accounts-filing/uploaded",
                    CHECK_YOUR_ANSWERS: "/accounts-filing/check-your-answers",
                    CONFIRMATION: "/accounts-filing/confirmation-submission",
                    COMPANY_SEARCH: "/accounts-filing/company-search",
                    CONFIRM_COMPANY: "/accounts-filing/confirm-company",
                }
            };

            expect(
                results.viewData
            ).toEqual(expectedCallValue);
        });

        it("should return an error when company number is missing", async () => {
            companyProfileServiceMock.getCompanyProfile.mockResolvedValue(
                {} as AccountsFilingCompanyProfile
            );

            await expect(
                handler.execute(mockReqMissingCompanyNumber as Request, {} as any)
            ).rejects.toThrow("Company number not set");
        });

        it("should return an error when company number is invalid format", async () => {
            companyProfileServiceMock.getCompanyProfile.mockResolvedValue(
                {} as AccountsFilingCompanyProfile
            );

            await expect(
                handler.execute(mockReqInvalidCompanyNumber as Request, {} as any)
            ).rejects.toThrow("Company number is invalid");
        });
    });

});
