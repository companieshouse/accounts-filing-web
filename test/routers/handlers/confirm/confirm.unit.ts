import { mockSession, resetMockSession } from "../../../mocks/session.middleware.mock";
import { mockGetCompanyProfile, companyProfileServiceMock } from "../../../mocks/company.profile.service.mock";
import mockCsrfProtectionMiddleware from "../../../mocks/csrf.protection.middleware.mock";

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
import { CompanyConfirmHandler } from "../../../../src/routers/handlers/company/confirm/confirm";
import { BaseViewData, ViewModel } from "../../../../src/routers/handlers/generic";
import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile";
import { PrefixedUrls } from "../../../../src/utils/constants/urls";
import { getSessionRequest } from "../../../mocks/session.mock";
import { getRequestWithCookie } from "../../helper/requests";

interface CompanyFilingIdData extends BaseViewData {
    companyProfile: CompanyProfile,
    changeCompanyUrl: string
}

const testEmail = "test@1";

describe("company auth test", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockCsrfProtectionMiddleware.mockClear();
    });

    afterEach(() => {
        resetMockSession();
    });

    it("does not redirect when the companyNumber query parameter checks session companyNumber", async () => {
        Object.assign(mockSession, getSessionRequest());
        mockSession.data.signin_info!.user_profile!.email = testEmail;
        mockSession.data.signin_info!.company_number = "00000000";

        await getRequestWithCookie(`${PrefixedUrls.CONFIRM_COMPANY}/?companyNumber=00000000`).expect(200);
    });

    it("should translate `Confirm and continue` to Welsh for confirm company page", async () => {
        Object.assign(mockSession, getSessionRequest());
        mockSession.data.signin_info!.user_profile!.email = testEmail;
        mockSession.data.signin_info!.company_number = "00000000";

        const req = await getRequestWithCookie(`${PrefixedUrls.CONFIRM_COMPANY}/?companyNumber=00000000&lang=cy`);
        expect(200);
        expect(req.text).toContain("Cadarnhau a pharhau");
    });

    it("should remain in English for confirm company page when lang is en", async () => {
        Object.assign(mockSession, getSessionRequest());
        mockSession.data.signin_info!.user_profile!.email = testEmail;
        mockSession.data.signin_info!.company_number = "00000000";

        const req = await getRequestWithCookie(`${PrefixedUrls.CONFIRM_COMPANY}/?companyNumber=00000000&lang=en`);
        expect(200);
        expect(req.text).toContain("Confirm and continue");
    });

    it("should remain in English for confirm company page by default", async () => {
        Object.assign(mockSession, getSessionRequest());
        mockSession.data.signin_info!.user_profile!.email = testEmail;

        mockSession.data.signin_info!.company_number = "00000000";

        const req = await getRequestWithCookie(`${PrefixedUrls.CONFIRM_COMPANY}/?companyNumber=00000000`);
        expect(200);
        expect(req.text).toContain("Confirm and continue");
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

    afterEach(() => {
        resetMockSession();
    });

    describe("execute method", () => {
        it("should return a valid viewData", async () => {
            companyProfileServiceMock.getCompanyProfile.mockResolvedValue(
                {} as CompanyProfile
            );
            Object.assign(mockSession, getSessionRequest());
            mockSession.data.signin_info!.user_profile!.email = testEmail;
            const results: ViewModel<CompanyFilingIdData> = await handler.execute({
                ...mockReq,
                session: mockSession
            } as Request, {} as any);

            expect(
                results.viewData.backURL
            ).toEqual("/accounts-filing/company-search?lang=en");
            expect(
                results.viewData.changeCompanyUrl
            ).toMatch("/company-lookup/search?forward=/accounts-filing/confirm-company?companyNumber=");
        });
    });

    describe("Confirmation page Welsh translation", () => {
        it("should translate `Support link` to Welsh for confirmation page", async () => {
            const req = await getRequestWithCookie(PrefixedUrls.CONFIRMATION + "?lang=cy");

            expect(req.text).toContain("Dolenni cymorth");
        });
    });

});

