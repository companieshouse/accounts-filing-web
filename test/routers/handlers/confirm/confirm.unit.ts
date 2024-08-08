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

    it("should translate `Confirm and continue` to Welsh for confirm company page", async () => {

        Object.assign(mockSession, getSessionRequest());

        mockSession.data.signin_info!.company_number = "00000000";

        const req = await request(app).get(`${PrefixedUrls.CONFIRM_COMPANY}/?companyNumber=00000000&lang=cy`);
        expect(200);
        expect(req.text).toContain("Cadarnhau a pharhau");
    });

    it("should remain in English for confirm company page when lang is en", async () => {

        Object.assign(mockSession, getSessionRequest());

        mockSession.data.signin_info!.company_number = "00000000";

        const req = await request(app).get(`${PrefixedUrls.CONFIRM_COMPANY}/?companyNumber=00000000&lang=en`);
        expect(200);
        expect(req.text).toContain("Confirm and continue");
    });

    it("should remain in English for confirm company page by default", async () => {

        Object.assign(mockSession, getSessionRequest());

        mockSession.data.signin_info!.company_number = "00000000";

        const req = await request(app).get(`${PrefixedUrls.CONFIRM_COMPANY}/?companyNumber=00000000`);
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

    describe("execute method", () => {
        it("should return a valid viewData", async () => {
            companyProfileServiceMock.getCompanyProfile.mockResolvedValue(
                {} as CompanyProfile
            );
            const results: ViewModel<CompanyFilingIdData> = await handler.execute(mockReq as Request, {} as any);

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

            const req = await request(app)
                .get(PrefixedUrls.CONFIRMATION + "?lang=cy");

            expect(req.text).toContain("Dolenni cymorth");
        });
    });

});

