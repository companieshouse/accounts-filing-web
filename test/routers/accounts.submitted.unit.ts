import { mockSession, resetMockSession } from "../mocks/session.middleware.mock";
import { getSessionRequest } from "../mocks/session.mock";
import request from "supertest";
import { ContextKeys } from "../../src/utils/constants/context.keys";
import express from "express";
import { mockTransactionService } from "../mocks/transaction.service.mock";
import app from "../../src/app";
import { PrefixedUrls } from "../../src/utils/constants/urls";


const session = {
    companyName: 'Test Company',
    companyNumber: '00006400',
    transactionId: '78910',
    userProfile: { email: 'test@companieshouse.gov.uk.com' }
};

describe("accounts submitted tests", () => {
    beforeEach(() => {
        Object.assign(mockSession, getSessionRequest());
        mockTransactionService.postTransactionRecord.mockResolvedValue({ id: "1" });
        mockSession.data.signin_info!.company_number = session.companyNumber;
        mockSession.setExtraData(ContextKeys.COMPANY_NAME, session.companyName);
        mockSession.setExtraData(ContextKeys.TRANSACTION_ID, session.transactionId);

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

    it("should throw error when session not properly set", async () => {
        resetMockSession();
        expect(await request(app).get(PrefixedUrls.ACCOUNTS_SUBMITTED)).rejects.toThrow;
    });

    it("Should contain email error when no email provided", async () => {
        Object.defineProperty(mockSession.data.signin_info, "user_profile", {
            value: {},
            writable: true
        });
        expect(request(app).get(PrefixedUrls.ACCOUNTS_SUBMITTED)).rejects.toThrow;
    });
    it("Should contain company name error when no company name provided", async () => {
        mockSession.setExtraData(ContextKeys.COMPANY_NAME, null);
        expect(request(app).get(PrefixedUrls.ACCOUNTS_SUBMITTED)).rejects.toThrow;
    });

    it("Should contain transaction id error when no transaction id provided", async () => {
        mockSession.setExtraData(ContextKeys.TRANSACTION_ID, null);
        expect(request(app).get(PrefixedUrls.ACCOUNTS_SUBMITTED)).rejects.toThrow;
    });

    it("Should contain company number error when no company number provided", async () => {
        mockSession.data.signin_info!.company_number = undefined;
        expect(request(app).get(PrefixedUrls.ACCOUNTS_SUBMITTED)).rejects.toThrow;
    });

    it("should handle successful submission", async () => {

        const response = await request(app).get(PrefixedUrls.ACCOUNTS_SUBMITTED);
        expect(response.statusCode).toBe(200);
        for (const key in session) {
            if (key === "userProfile") {
                expect(response.text).toContain(session[key]["email"]);
                continue;
            }
            expect(response.text).toContain(session[key]);
        }
    });
});
