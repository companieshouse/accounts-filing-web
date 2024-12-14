
import { PrefixedUrls } from "../../src/utils/constants/urls";
import app from "../../src/app";
import request from "supertest";
import { mockSession } from "../mocks/session.middleware.mock";
import { getSessionRequest } from "../mocks/session.mock";
import { ContextKeys } from "../../src/utils/constants/context.keys";
import express from "express";

const session = {
    companyName: 'Test Company',
    companyNumber: "00006400",
    accountsFilingId: '78910',
    userProfile: { email: 'test@companieshouse.gov.uk' }
};

describe("company search router", () => {

    beforeEach(() => {
        Object.assign(mockSession, getSessionRequest());
        mockSession.data.signin_info!.company_number = session.companyNumber;
        mockSession.setExtraData(ContextKeys.COMPANY_NAME, session.companyName);
        mockSession.setExtraData(ContextKeys.ACCOUNTS_FILING_ID, session.accountsFilingId);
        mockSession.setExtraData(ContextKeys.COMPANY_NUMBER, session.companyNumber);

        Object.defineProperty(mockSession.data.signin_info, "user_profile", {
            value: session.userProfile,
            writable: true
        });

        app.use(express.json());

        app.use((req, res, next) => {
            req.session = mockSession;
            next();
        });
    });

    it("should show status 302", async () => {
        const url = PrefixedUrls.COMPANY_SEARCH;
        const resp = await request(app).get(url);

        expect(resp.status).toBe(302);
    });

    it("should show status 302 and redirect to choose packageaccount page", async () => {
        const url = PrefixedUrls.COMPANY_SEARCH;
        const resp = await request(app).get(url);

        expect(resp.status).toBe(302);
        expect(resp.header["location"]).toBe("/accounts-filing/choose-your-accounts-package?companyNumber=00006400");
    });
});
