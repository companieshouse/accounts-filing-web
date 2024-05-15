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
    chooseAccountsPackageLink: string,
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

});

describe("CompanyConfirmHandler", () => {

    let handler: CompanyConfirmHandler;
    let mockReq: Partial<Request>;

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
                results.viewData.chooseAccountsPackageLink
            ).toEqual("/accounts-filing/choose-your-accounts-package");
            expect(
                results.viewData.changeCompanyUrl
            ).toMatch("/company-lookup/search?forward=/accounts-filing/confirm-company?companyNumber=");
        });
    });


});

