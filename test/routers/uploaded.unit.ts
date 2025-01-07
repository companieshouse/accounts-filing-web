import mockCsrfProtectionMiddleware from "../mocks/csrf.protection.middleware.mock";
import { mockSession, resetMockSession } from "../mocks/session.middleware.mock";
import { getSessionRequest } from "../mocks/session.mock";
import { mockAccountsFilingService } from "../mocks/accounts.filing.service.mock";
import { PrefixedUrls } from "../../src/utils/constants/urls";
import { getRequestWithCookie } from "./helper/requests";

import { ContextKeys } from "../../src/utils/constants/context.keys";


describe("Check your answers test", () => {
    beforeEach(() => {
        mockCsrfProtectionMiddleware.mockClear();
        resetMockSession();
        getSessionRequest();
    });

    afterEach(() => {

    });


    it("Should redirect to sigin when company number do not match", async () => {
        // @ts-expect-error overrides typescript to allow setting the signin_info for testing
        mockSession.data['signin_info'] = { company_number: "00000000" };
        mockSession!.setExtraData(ContextKeys.PACKAGE_TYPE, "uksef");
        mockSession!.setExtraData(ContextKeys.COMPANY_NUMBER, "00000001");
        mockSession.data['signin_info']['signed_in'] = 1;
        const resp = await getRequestWithCookie(PrefixedUrls.UPLOADED);

        expect(resp.status).toBe(302);
        // The make sure it redirects to the sigin page
        expect(resp.headers.location).toContain("signin");
    });

});

describe("Post uploaded validation results", () => {

    const fileId = "00000000-0000-0000-0000-000000000000";
    const fileName = "nameOfFile";

    beforeEach(() => {
        mockCsrfProtectionMiddleware.mockClear();
        resetMockSession();
        getSessionRequest();
        mockAccountsFilingService.getValidationStatus = jest.fn(
            () => Promise.resolve({ "resource": {
                status: "complete",
                result: {
                    errorMessages: [],
                    validationStatus: "FAILED"
                },
                fileId,
                fileName
            } }));
    });

    it("The upload your accounts file should when clicked return to upload your accout file", async () => {
        Object.assign(mockSession, getSessionRequest());
        mockSession.data.signin_info!.company_number = "00000000";
        mockSession!.setExtraData(ContextKeys.TRANSACTION_ID, "008008008");
        mockSession!.setExtraData(ContextKeys.ACCOUNTS_FILING_ID, "008008008");
        mockSession!.setExtraData(ContextKeys.PACKAGE_TYPE, "uksef");
        mockSession!.setExtraData(ContextKeys.COMPANY_NUMBER, "00000000");
        mockSession.data.signin_info!.signed_in = 1;
        mockSession.data.signin_info!.user_profile!.email = "test";

        const resp = await getRequestWithCookie(PrefixedUrls.UPLOADED + "/" + fileId);

        expect(resp.status).toBe(200);
        expect(resp.text).toContain("You will then need to <a class=\"govuk-link\" href='http://chs.local/xbrl_validate/submit?callback=");
    });
});
