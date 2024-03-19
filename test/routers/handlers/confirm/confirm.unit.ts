import { Request } from "express";
import { CompanyConfirmHandler } from "../../../../src/routers/handlers/company/confirm/confirm";
import { companyProfileServiceMock } from "../../../mocks/company.profile.service.mock";
import { BaseViewData, ViewModel } from "../../../../src/routers/handlers/generic";
import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile";

interface CompanyFilingIdData extends BaseViewData {
    companyProfile: CompanyProfile,
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
                {} as CompanyProfile
            );
            const results: ViewModel<CompanyFilingIdData> = await handler.execute(mockReq as Request, {} as any);

            expect(
                results.viewData.backURL
            ).toEqual("/accounts-filing/company-search/");
            expect(
                results.viewData.uploadLink
            ).toEqual("/accounts-filing/company/12345678/upload");
            expect(
                results.viewData.changeCompanyUrl
            ).toMatch("/company-lookup/search?forward=/accounts-filing/confirm-company?companyNumber=");
        });

        it("should return an error when company number is missing", async () => {
            companyProfileServiceMock.getCompanyProfile.mockResolvedValue(
                {} as CompanyProfile
            );

            await expect(
                handler.execute(mockReqMissingCompanyNumber as Request, {} as any)
            ).rejects.toThrow("Company number is invalid");
        });

        it("should return an error when company number is invalid format", async () => {
            companyProfileServiceMock.getCompanyProfile.mockResolvedValue(
                {} as CompanyProfile
            );

            await expect(
                handler.execute(mockReqInvalidCompanyNumber as Request, {} as any)
            ).rejects.toThrow("Company number is invalid");
        });
    });

});
