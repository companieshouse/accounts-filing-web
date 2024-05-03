import app from "../../../../src/app";
import request from "supertest";
import { PrefixedUrls } from "../../../../src/utils/constants/urls";

describe("Payment call back test", () => {
    it("Should render the check you answers page on payment failure get request", async () => {
        const resp = await request(app).get(`${PrefixedUrls.PAYMENT_CALLBACK}?ref=Accounts_Filing_6634b9a82f93933ecb6a4745&state=123456&status=failed`);
        expect(resp.status).toBe(302);
        expect(resp.text).toContain(PrefixedUrls.CHECK_YOUR_ANSWERS);
    });
    it("Should render the comfirmation page on successful payment get request", async () => {
        const resp = await request(app).get(`${PrefixedUrls.PAYMENT_CALLBACK}?ref=Accounts_Filing_6634b9a82f93933ecb6a4745&state=123456&status=paid`);
        expect(resp.status).toBe(302);
        expect(resp.text).toContain(PrefixedUrls.CONFIRMATION);
    });
});
