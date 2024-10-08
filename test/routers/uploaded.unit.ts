import { mockSession, resetMockSession } from "../mocks/session.middleware.mock";
import { getSessionRequest } from "../mocks/session.mock";
import { mockAccountsFilingService } from "../mocks/accounts.filing.service.mock";
import { PrefixedUrls } from "../../src/utils/constants/urls";

import request from "supertest";
import app from "../../src/app";
import { ContextKeys } from "../../src/utils/constants/context.keys";


describe("Check your answers test", () => {
    beforeEach(() => {
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

        const resp = await request(app).get(PrefixedUrls.UPLOADED);

        expect(resp.status).toBe(302);
        // The make sure it redirects to the sigin page
        expect(resp.headers.location).toContain("signin");
    });

});

describe("Post uploaded validation results", () => {

    const fileId = "00000000-0000-0000-0000-000000000000";
    const fileName = "nameOfFile";

    beforeEach(() => {
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

        // @ts-expect-error overrides typescript to allow setting the signin_info for testing
        mockSession.data['signin_info'] = { company_number: "00000000" };
        mockSession!.setExtraData(ContextKeys.PACKAGE_TYPE, "uksef");
        mockSession!.setExtraData(ContextKeys.COMPANY_NUMBER, "00000000");
        mockSession.data['signin_info']['signed_in'] = 1;

        const resp = await request(app).get(PrefixedUrls.UPLOADED + "/" + fileId);

        expect(resp.status).toBe(200);
        expect(resp.text).toContain("You'll need to update the file. Once it's valid, you'll need to <a class=\"govuk-link\" href='http://chs.local/xbrl_validate/submit?callback=");
    });
});
