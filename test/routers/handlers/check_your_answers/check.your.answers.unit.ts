import { mockSession } from "../../../mocks/session.middleware.mock";
import { mockTranactionService } from "../../../mocks/transaction.service.mock";

import app from "../../../../src/app";
import request from "supertest";
import { PrefixedUrls } from "../../../../src/utils/constants/urls";
import { setValidationResult } from "../../../../src/utils/session";
import { AccountValidatorResponse } from "private-api-sdk-node/dist/services/account-validator/types";


describe("Check your answers test", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("Should render the page on get request", async () => {
        const fileName = "fileName";
        
        setValidationResult(mockSession, {
            fileId: "fileId",
            fileName: fileName
        } as AccountValidatorResponse);


        const resp = await request(app).get(PrefixedUrls.CHECK_YOUR_ANSWERS);

        expect(resp.status).toBe(200);
        // The filename should be on the check your details page.
        expect(resp.text).toContain(fileName);
    });

    it("Should close the transaction and navigate to the confirmation page when recieving  apost request", async () => {
        mockTranactionService.closeTransaction.mockResolvedValue(undefined);
        
        const resp = await request(app).post(PrefixedUrls.CHECK_YOUR_ANSWERS);

        expect(mockTranactionService.closeTransaction).toHaveBeenCalledTimes(1);

        // It Should redirect to the confirmation page
        expect(resp.status).toBe(302);
        expect(resp.headers.location).toBe(PrefixedUrls.CONFIRMATION);
    });
});
