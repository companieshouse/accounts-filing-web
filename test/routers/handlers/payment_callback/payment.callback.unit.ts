import mockCsrfProtectionMiddleware from "../../../mocks/csrf.protection.middleware.mock";
import { PrefixedUrls } from "../../../../src/utils/constants/urls";
import { mockAuthenticationMiddleware } from "../../../mocks/all.middleware.mock";
import { getRequestWithCookie } from "../../helper/requests";

describe("Payment callback tests", () => {

    beforeAll(() => {
        mockCsrfProtectionMiddleware.mockClear();
    });

    it("Should render the comfirmation page for successful payment", async () => {
        const resp = await getRequestWithCookie(`${PrefixedUrls.PAYMENT_CALLBACK}?ref=Accounts_Filing_6634b9a82f93933ecb6a4745&state=123456&status=paid`);
        expect(resp.status).toBe(302);
        expect(resp.text).toContain(PrefixedUrls.CONFIRMATION);
        expect(resp.text).not.toContain(PrefixedUrls.CHECK_YOUR_ANSWERS);
        expect(mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("Should render the check you answers page for failed payment", async () => {
        const resp = await getRequestWithCookie(`${PrefixedUrls.PAYMENT_CALLBACK}?ref=Accounts_Filing_6634b9a82f93933ecb6a4745&state=123456&status=failed`);
        expect(resp.status).toBe(302);
        expect(resp.text).toContain(PrefixedUrls.CHECK_YOUR_ANSWERS);
        expect(resp.text).not.toContain(PrefixedUrls.CONFIRMATION);
        expect(mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("Should render the check you answers page for cancelled payment", async () => {
        const resp = await getRequestWithCookie(`${PrefixedUrls.PAYMENT_CALLBACK}?ref=Accounts_Filing_6634b9a82f93933ecb6a4745&state=123456&status=cancelled`);
        expect(resp.status).toBe(302);
        expect(resp.text).toContain(PrefixedUrls.CHECK_YOUR_ANSWERS);
        expect(resp.text).not.toContain(PrefixedUrls.CONFIRMATION);
        expect(mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should error if state doesn't match session state", async () => {
        const resp = await getRequestWithCookie(`${PrefixedUrls.PAYMENT_CALLBACK}?ref=Accounts_Filing_6634b9a82f93933ecb6a4745&state=123123&status=paid`);
        expect(resp.status).toBe(500);
        expect(resp.text).toContain("Internal server error");
        expect(mockAuthenticationMiddleware).toHaveBeenCalled();
    });

});

describe("Payment page translation", () => {
    it("should translate `Support link` to Welsh for payment page", async () => {

        const req = await getRequestWithCookie(PrefixedUrls.PAYMENT + "?lang=cy");

        expect(req.text).toContain("Dolenni cymorth");
    });
});
