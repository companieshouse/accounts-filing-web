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
import { getLoggedInSession } from "../../../mocks/session.mock";
import { getRequestWithCookie } from "../../helper/requests";
import { setEnvVars } from "../../../test_utils";

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
        Object.assign(mockSession, getLoggedInSession());
        mockSession.data.signin_info!.user_profile!.email = testEmail;
        mockSession.data.signin_info!.company_number = "00000000";

        await getRequestWithCookie(`${PrefixedUrls.CONFIRM_COMPANY}/?companyNumber=00000000`).expect(200);
    });

    it("should translate `Confirm and continue` to Welsh for confirm company page", async () => {
        Object.assign(mockSession, getLoggedInSession());
        mockSession.data.signin_info!.user_profile!.email = testEmail;
        mockSession.data.signin_info!.company_number = "00000000";

        const req = await getRequestWithCookie(`${PrefixedUrls.CONFIRM_COMPANY}/?companyNumber=00000000&lang=cy`);
        expect(200);
        expect(req.text).toContain("Cadarnhau a pharhau");
    });

    it("should remain in English for confirm company page when lang is en", async () => {
        Object.assign(mockSession, getLoggedInSession());
        mockSession.data.signin_info!.user_profile!.email = testEmail;
        mockSession.data.signin_info!.company_number = "00000000";

        const req = await getRequestWithCookie(`${PrefixedUrls.CONFIRM_COMPANY}/?companyNumber=00000000&lang=en`);
        expect(200);
        expect(req.text).toContain("Confirm and continue");
    });

    it("should remain in English for confirm company page by default", async () => {
        Object.assign(mockSession, getLoggedInSession());
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
            Object.assign(mockSession, getLoggedInSession());
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

        it("should set nextURL to stop page for BR numbers when feature flag is on", async () => {
            const cleanup = setEnvVars({ FEATURE_FLAG_BR_COMPANY_STOP_SCREEN: true });
            companyProfileServiceMock.getCompanyProfile.mockResolvedValue({} as CompanyProfile);
            Object.assign(mockSession, getSessionRequest());
            mockSession.data.signin_info!.user_profile!.email = testEmail;

            const results: ViewModel<CompanyFilingIdData> = await handler.execute({
                ...mockReq,
                query: { companyNumber: "BR000804" },
                session: mockSession
            } as Request, {} as any);

            expect(results.viewData.nextURL).toEqual("/accounts-filing/cannot-file-full-accounts-for-company-type?lang=en");
            cleanup();
        });

        it("should keep nextURL as choose package for BR numbers when feature flag is off", async () => {
            const cleanup = setEnvVars({ FEATURE_FLAG_BR_COMPANY_STOP_SCREEN: false });
            companyProfileServiceMock.getCompanyProfile.mockResolvedValue({} as CompanyProfile);
            Object.assign(mockSession, getSessionRequest());
            mockSession.data.signin_info!.user_profile!.email = testEmail;

            const results: ViewModel<CompanyFilingIdData> = await handler.execute({
                ...mockReq,
                query: { companyNumber: "BR000804" },
                session: mockSession
            } as Request, {} as any);

            expect(results.viewData.nextURL).toEqual("/accounts-filing/choose-your-accounts-package?lang=en");
            cleanup();
        });
    });

    describe("Confirmation page Welsh translation", () => {
        it("should translate `Support link` to Welsh for confirmation page", async () => {
            const req = await getRequestWithCookie(PrefixedUrls.CONFIRMATION + "?lang=cy");

            expect(req.text).toContain("Dolenni cymorth");
        });
    });

});
