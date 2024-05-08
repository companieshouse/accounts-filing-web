import { mockSession, resetMockSession } from "../mocks/session.middleware.mock";
import { getSessionRequest } from "../mocks/session.mock";
import { PrefixedUrls } from "../../src/utils/constants/urls";

import request from "supertest";
import app from "../../src/app";
import { ContextKeys } from "../../src/utils/constants/context.keys";
import { Account } from "../../src/utils/constants/paymentTypes";


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
        mockSession!.setExtraData(ContextKeys.PACKAGE_TYPE, Account.uksef.name);
        mockSession!.setExtraData(ContextKeys.COMPANY_NUMBER, "00000001");
        mockSession.data['signin_info']['signed_in'] = 1;

        const resp = await request(app).get(PrefixedUrls.UPLOADED);

        expect(resp.status).toBe(302);
        // The make sure it redirects to the sigin page
        expect(resp.headers.location).toContain("signin");
    });

});
