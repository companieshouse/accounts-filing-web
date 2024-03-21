import { mockSession, resetMockSession } from "../../../mocks/session.middleware.mock";
import { mockGetCompanyProfile, companyProfileServiceMock } from "../../../mocks/company.profile.service.mock";
mockGetCompanyProfile.mockResolvedValue({
    companyName: 'Test Company',
    companyNumber: '12345678',
    type: "companyProfileType",
    companyStatus: "active",
    registeredOfficeAddress: {
        addressLineOne: "one",
        addressLineTwo: "two",
        postalCode: "postalCode"
    },
    accounts: {
        nextAccounts: {
            periodStartOn: "2000-01-01"
        },
        nextDue: "2000-01-01"
    },
    dateOfCreation: "2000-01-01",
}
);

import { Request } from "express";
import request from "supertest";
import { CompanyConfirmHandler } from "../../../../src/routers/handlers/company/confirm/confirm";
import { BaseViewData, ViewModel } from "../../../../src/routers/handlers/generic";
import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile";
import app from "../../../../src/app";
import { PrefixedUrls } from "../../../../src/utils/constants/urls";
import { getSessionRequest } from "../../../mocks/session.mock";

interface CompanyFilingIdData extends BaseViewData {
    companyProfile: CompanyProfile,
    uploadLink: string,
    changeCompanyUrl: string
}

describe("company auth test", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        resetMockSession();
    });

    it("does not redirect when the companyNumber query parameter checks session companyNumber", async () => {

        Object.assign(mockSession, getSessionRequest());

        mockSession.data.signin_info!.company_number = "00000000";

        await request(app).get(`${PrefixedUrls.CONFIRM_COMPANY}/?companyNumber=00000000`).expect(200);
    });

    it("redirect to company auth when there is not companyNumber in session", async () => {
        await request(app).get(`${PrefixedUrls.CONFIRM_COMPANY}/?companyNumber=00000000`).expect(302);
    });

    it("redirect to company auth when the companyNumber query parameter does not match what is in the session", async () => {
        // @ts-expect-error because signin_info read only
        mockSession.data.signin_info?.company_number = "NO";

        await request(app).get(`${PrefixedUrls.CONFIRM_COMPANY}/?companyNumber=00000000`).expect(302);
    });

});

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
            ).toEqual("/accounts-filing/upload");
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

