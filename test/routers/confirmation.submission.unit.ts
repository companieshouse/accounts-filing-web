import { mockSession, resetMockSession } from "../mocks/session.middleware.mock";
import { getSessionRequest } from "../mocks/session.mock";
import request from "supertest";
import { ContextKeys } from "../../src/utils/constants/context.keys";
import express from "express";
import app from "../../src/app";
import { PrefixedUrls } from "../../src/utils/constants/urls";
import { setExtraDataCompanyNumber } from "../../src/utils/session";
import { fees } from "../../src/utils/constants/fees";


const session = {
    companyName: 'Test Company',
    companyNumber: '00006400',
    accountsFilingId: '78910',
    userProfile: { email: 'test@companieshouse.gov.uk' }
};

describe("accounts submitted tests", () => {
    let server: any;

    beforeAll((done) => {
        server = app.listen(done);
    });

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

    afterEach(() => {
        resetMockSession();
    });

    afterAll((done) => {
        server.close(done);
    });

    it("should throw error when session not properly set", async () => {
        resetMockSession();
        expect(await request(server).get(PrefixedUrls.CONFIRMATION)).rejects.toThrow;
    });

    it("Should contain email error when no email provided", async () => {
        Object.defineProperty(mockSession.data.signin_info, "user_profile", {
            value: {},
            writable: true
        });
        expect(request(server).get(PrefixedUrls.CONFIRMATION)).rejects.toThrow;
    });

    it("Should contain company name error when no company name provided", async () => {
        mockSession.setExtraData(ContextKeys.COMPANY_NAME, null);
        expect(request(server).get(PrefixedUrls.CONFIRMATION)).rejects.toThrow;
    });

    it("Should contain transaction id error when no accounts filing id provided", async () => {
        mockSession.setExtraData(ContextKeys.ACCOUNTS_FILING_ID, null);
        expect(request(server).get(PrefixedUrls.CONFIRMATION)).rejects.toThrow;
    });

    it("Should contain company number error when no company number provided", async () => {
        mockSession.data.signin_info!.company_number = undefined;
        expect(request(server).get(PrefixedUrls.CONFIRMATION)).rejects.toThrow;
    });

    it("should handle successful submission with overseas accounts", async () => {
        mockSession.setExtraData(ContextKeys.PACKAGE_TYPE, "overseas");
        setExtraDataCompanyNumber(mockSession, "00006400");

        const response = await request(server).get(PrefixedUrls.CONFIRMATION);
        expect(response.statusCode).toBe(200);
        expect(response.text).toContain("Payment received");
        expect(response.text).toContain(`£${fees.overseas}`);
        expect(response.text).toContain(PrefixedUrls.COMPANY_SEARCH);
        expect(response.text).toContain(PrefixedUrls.CHOOSE_YOUR_ACCOUNTS_PACKAGE);
        expect(response.text).toContain("<a class=\"govuk-back-link\" href=\"\" style=\"visibility: hidden;\">Back</a>");
        for (const key in session) {
            if (key === "userProfile") {
                expect(response.text).toContain(session[key]["email"]);
                continue;
            }
            expect(response.text).toContain(session[key]);
        }
    });

    it("should handle successful submission with cic accounts", async () => {
        mockSession.setExtraData(ContextKeys.PACKAGE_TYPE, "cic");
        const response = await request(server).get(PrefixedUrls.CONFIRMATION);
        expect(response.statusCode).toBe(200);
        expect(response.text).toContain("Payment received");
        expect(response.text).toContain(`£${fees.cic}`);
        expect(response.text).toContain(PrefixedUrls.COMPANY_SEARCH);
        expect(response.text).toContain(PrefixedUrls.CHOOSE_YOUR_ACCOUNTS_PACKAGE);
        expect(response.text).toContain("<a class=\"govuk-back-link\" href=\"\" style=\"visibility: hidden;\">Back</a>");
        for (const key in session) {
            if (key === "userProfile") {
                expect(response.text).toContain(session[key]["email"]);
                continue;
            }
            expect(response.text).toContain(session[key]);
        }
    });

    it("should handle successful submission with welsh accounts", async () => {
        mockSession.setExtraData(ContextKeys.PACKAGE_TYPE, {
            name: "welsh",
            description: "Welsh accounts with an English translation",
            disabled: false,
        });
        const response = await request(server).get(PrefixedUrls.CONFIRMATION);
        expect(response.statusCode).toBe(200);
        expect(response.text).not.toContain("Payment received");
        expect(response.text).toContain(PrefixedUrls.COMPANY_SEARCH);
        expect(response.text).toContain(PrefixedUrls.CHOOSE_YOUR_ACCOUNTS_PACKAGE);
        expect(response.text).toContain("<a class=\"govuk-back-link\" href=\"\" style=\"visibility: hidden;\">Back</a>");
        for (const key in session) {
            if (key === "userProfile") {
                expect(response.text).toContain(session[key]["email"]);
                continue;
            }
            expect(response.text).toContain(session[key]);
        }
    });

    it("should throw error for unsuccessful submission with league of legends account", async () => {
        mockSession.setExtraData(ContextKeys.PACKAGE_TYPE, "League of Legends");
        expect(request(server).get(PrefixedUrls.CONFIRMATION)).rejects.toThrow;
    });

    it("Should redirect to sigin when company number do not match", async () => {

        // @ts-expect-error overrides typescript to allow setting the signin_info for testing
        mockSession.data['signin_info']['signed_in'] = 1;
        mockSession!.setExtraData(ContextKeys.COMPANY_NUMBER, "00000001");


        const resp = await request(server).get(PrefixedUrls.CONFIRMATION);

        expect(resp.status).toBe(302);
        // The make sure it redirects to the sigin page
        expect(resp.headers.location).toContain("signin");
    });
});
