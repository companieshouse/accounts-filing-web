import { mockSession, resetMockSession } from "../../../mocks/session.middleware.mock";
import { mockTransactionService } from "../../../mocks/transaction.service.mock";

import app from "../../../../src/app";
import request from "supertest";
import { PrefixedUrls } from "../../../../src/utils/constants/urls";
import { setValidationResult } from "../../../../src/utils/session";
import { AccountValidatorResponse } from "private-api-sdk-node/dist/services/account-validator/types";


describe("Check your answers test", () => {
    beforeEach(() => {
        resetMockSession();
        jest.clearAllMocks();
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
});
