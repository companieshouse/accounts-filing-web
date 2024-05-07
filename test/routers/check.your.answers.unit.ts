import { mockSession, resetMockSession } from "../mocks/session.middleware.mock";
import { mockTransactionService } from "../mocks/transaction.service.mock";

import app from "../../src/app";
import request from "supertest";
import { PrefixedUrls } from "../../src/utils/constants/urls";
import { setValidationResult } from "../../src/utils/session";
import { AccountValidatorResponse } from "private-api-sdk-node/dist/services/account-validator/types";
import { ContextKeys } from "../../src/utils/constants/context.keys";
import { PackageAccounts } from "../../src/utils/constants/packageAccounts";
import { getSessionRequest } from "../mocks/session.mock";


describe("Check your answers test", () => {
    beforeEach(() => {
        resetMockSession();
        getSessionRequest();
    });

    afterEach(() => {

    });

    it("Should render the page on get request", async () => {
        const fileName = "fileName";

        setValidationResult(mockSession, {
            fileId: "fileId",
            fileName: fileName,
        } as AccountValidatorResponse);

        // @ts-expect-error overrides typescript to allow setting the signin_info for testing
        mockSession.data['signin_info'] = { company_number: "00000000" };
        mockSession!.setExtraData(ContextKeys.PACKAGE_TYPE, PackageAccounts.uksef.name);
        mockSession!.setExtraData(ContextKeys.COMPANY_NUMBER, "00000000");
        mockSession.data['signin_info']['signed_in'] = 1;

        const resp = await request(app).get(PrefixedUrls.CHECK_YOUR_ANSWERS);

        expect(resp.status).toBe(200);
        // The filename should be on the check your details page.
        expect(resp.text).toContain(fileName);
    });

    it("Should redirect to sigin when company number do not match", async () => {
        const fileName = "fileName";

        setValidationResult(mockSession, {
            fileId: "fileId",
            fileName: fileName,
        } as AccountValidatorResponse);

        // @ts-expect-error overrides typescript to allow setting the signin_info for testing
        mockSession.data['signin_info'] = { company_number: "00000000" };
        mockSession!.setExtraData(ContextKeys.PACKAGE_TYPE, PackageAccounts.uksef.name);
        mockSession!.setExtraData(ContextKeys.COMPANY_NUMBER, "00000001");
        mockSession.data['signin_info']['signed_in'] = 1;

        const resp = await request(app).get(PrefixedUrls.CHECK_YOUR_ANSWERS);

        expect(resp.status).toBe(302);
        // The make sure it redirects to the sigin page
        expect(resp.headers.location).toContain("signin");
    });

    it("Should render a 500 page on get request when package is not in session", async () => {
        const fileName = "fileName";

        setValidationResult(mockSession, {
            fileId: "fileId",
            fileName: fileName,
        } as AccountValidatorResponse);

        // @ts-expect-error overrides typescript to allow setting the signin_info for testing
        mockSession.data['signin_info'] = { company_number: "00000000" };
        mockSession!.setExtraData(ContextKeys.PACKAGE_TYPE, PackageAccounts.uksef.name);
        mockSession.data['signin_info']['signed_in'] = 1;

        const resp = await request(app).get(PrefixedUrls.CHECK_YOUR_ANSWERS);

        expect(resp.status).toBe(500);
        // Check if it on the 500 error page
        expect(resp.text).toContain("500");
    });

    it("Should close the transaction and navigate to the confirmation page when recieving a post request", async () => {
        mockTransactionService.closeTransaction.mockResolvedValue(undefined);
        // @ts-expect-error overrides typescript to allow setting the signin_info for testing
        mockSession.data['signin_info'] = { company_number: "00000000" };
        mockSession.setExtraData(ContextKeys.COMPANY_NUMBER, "00000000");
        mockSession.setExtraData(ContextKeys.PACKAGE_TYPE, "uksef");
        mockSession.data['signin_info']['signed_in'] = 1;

        const resp = await request(app).post(PrefixedUrls.CHECK_YOUR_ANSWERS);

        expect(mockTransactionService.closeTransaction).toHaveBeenCalledTimes(1);

        // It Should redirect to the confirmation page
        expect(resp.status).toBe(302);
        expect(resp.headers.location).toBe(PrefixedUrls.CONFIRMATION);
    });
});
