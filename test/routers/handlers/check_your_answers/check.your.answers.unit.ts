jest.mock("../../../../src/services/external/payment.service");

import { mockSession, resetMockSession } from "../../../mocks/session.middleware.mock";
import { mockTransactionService } from "../../../mocks/transaction.service.mock";

import app from "../../../../src/app";
import request from "supertest";
import { PrefixedUrls } from "../../../../src/utils/constants/urls";
import { setValidationResult } from "../../../../src/utils/session";
import { AccountValidatorResponse } from "private-api-sdk-node/dist/services/account-validator/types";
import { startPaymentsSession } from "../../../../src/services/external/payment.service";
import { mockPayment, PAYMENT_JOURNEY_URL } from "../../../mocks/payment.mock";
import { Payment } from "@companieshouse/api-sdk-node/dist/services/payment";
import { ApiResponse } from "@companieshouse/api-sdk-node/dist/services/resource";
import { ContextKeys } from "../../../../src/utils/constants/context.keys";

const mockStartPaymentsSession = startPaymentsSession as jest.Mock;

const mockPaymentHeaders = {
    header1: "45435435"
};
const mockPaymentResponse = {
    headers: mockPaymentHeaders,
    httpStatusCode: 200,
    resource: mockPayment
} as ApiResponse<Payment>;
const PAYMENT_URL = "/payment/1234";

describe("Check your answers test", () => {
    beforeEach(() => {
        resetMockSession();
        jest.clearAllMocks();
        mockSession.setExtraData(ContextKeys.ACCOUNTS_FILING_ID, "mockAccFilingId");
        mockSession.setExtraData(ContextKeys.TRANSACTION_ID, "mockTransId");
    });

    it("Should render the page on get request", async () => {
        const fileName = "fileName";

        setValidationResult(mockSession, {
            fileId: "fileId",
            fileName: fileName,
        } as AccountValidatorResponse);

        // @ts-expect-error overrides typescript to allow setting the signin_info for testing
        mockSession.data['signin_info'] = { company_number: "00000000" };

        mockSession!.setExtraData("packageType", "uksef");

        const resp = await request(app).get(PrefixedUrls.CHECK_YOUR_ANSWERS);

        expect(resp.status).toBe(200);
        // The filename should be on the check your details page.
        expect(resp.text).toContain(fileName);
    });

    it("Should render a 500 page on get request when package is not in session", async () => {
        const fileName = "fileName";

        setValidationResult(mockSession, {
            fileId: "fileId",
            fileName: fileName,
        } as AccountValidatorResponse);

        // @ts-expect-error overrides typescript to allow setting the signin_info for testing
        mockSession.data['signin_info'] = { company_number: "00000000" };

        const resp = await request(app).get(PrefixedUrls.CHECK_YOUR_ANSWERS);

        expect(resp.status).toBe(500);
        // The filename should be on the check your details page.
        expect(resp.text).toContain("500");
    });

    it("Should close the transaction and navigate to the confirmation page when recieving a post request", async () => {
        mockTransactionService.closeTransaction.mockResolvedValue(undefined);

        const resp = await request(app).post(PrefixedUrls.CHECK_YOUR_ANSWERS);

        expect(mockTransactionService.closeTransaction).toHaveBeenCalledTimes(1);

        // It Should redirect to the confirmation page
        expect(resp.status).toBe(302);
        expect(resp.headers.location).toBe(PrefixedUrls.CONFIRMATION);
    });

    it("Should close the transaction and navigate to the payment jouney when receiving a payment url from close transaction", async () => {
        mockTransactionService.closeTransaction.mockResolvedValue(PAYMENT_URL);
        mockStartPaymentsSession.mockResolvedValueOnce(mockPaymentResponse);
        const resp = await request(app).post(PrefixedUrls.CHECK_YOUR_ANSWERS);
        // It Should redirect to the payment journey page
        expect(resp.status).toBe(302);
        expect(resp.header.location).toBe(PAYMENT_JOURNEY_URL);
    });
});
