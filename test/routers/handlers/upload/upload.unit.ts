import { mockTransactionService } from "../../../mocks/transaction.service.mock";
import { mockAccountsFilingService } from "../../../mocks/accounts.filing.service.mock";
import { mockSession, resetMockSession } from "../../../mocks/session.middleware.mock";
import { getSessionRequest } from "../../../mocks/session.mock";
import request from "supertest";
import app from "../../../../src/app";
import { PrefixedUrls } from "../../../../src/utils/constants/urls";
import { ContextKeys } from "../../../../src/utils/constants/context.keys";
import { packageTypeOption } from "../../../../src/routers/handlers/choose_your_package_accounts/package.type.options";

describe("company auth test", () => {

    const companyNumber = "00000000";

    beforeEach(() => {
        jest.clearAllMocks();

    });

    afterEach(() => {
        resetMockSession();
    });

    it("does not redirect to company auth when the companyNumber query parameter checks session companyNumber", async () => {

        Object.assign(mockSession, getSessionRequest());

        mockTransactionService.postTransactionRecord.mockResolvedValue({ id: "1" });
        mockAccountsFilingService.checkCompany.mockResolvedValue({
            httpStatusCode: 200,
            resource: {
                accountsFilingId: "1"
            }
        });

        mockSession.data.signin_info!.company_number = companyNumber;
        mockSession.setExtraData(ContextKeys.COMPANY_NAME, "Test Company");
        mockSession.setExtraData(ContextKeys.COMPANY_NUMBER, companyNumber);
        mockSession.setExtraData(ContextKeys.PACKAGE_TYPE, "uksef");

        const resp = await request(app).get(`${PrefixedUrls.UPLOAD}`);
        expect(resp.statusCode).toEqual(302);
        expect(resp.headers["location"]).toContain("xbrl_validate");
    });

    it("redirect to company auth when there is not companyNumber in session", async () => {
        await request(app).get(`${PrefixedUrls.UPLOAD}`).expect(500);
    });

    it("redirect to company auth when the companyNumber no extraData session", async () => {
        // @ts-expect-error because signin_info read only
        mockSession.data.signin_info?.company_number = "NO";

        await request(app).get(`${PrefixedUrls.UPLOAD}`).expect(500);
    });

    it("redirect to company auth when the companyNumber extraData session does not match what is in the session", async () => {
        // @ts-expect-error because signin_info read only
        mockSession.data.signin_info?.company_number = "NO";
        mockSession.setExtraData(ContextKeys.COMPANY_NUMBER, companyNumber);

        await request(app).get(`${PrefixedUrls.UPLOAD}`).expect(302);
    });

    it("redirect to company auth when the companyNumber extraData session but nothing in the signin_info", async () => {
        mockSession.setExtraData(ContextKeys.COMPANY_NUMBER, companyNumber);

        await request(app).get(`${PrefixedUrls.UPLOAD}`).expect(302);
    });

});

describe("Welsh translation", () => {
    it("should translate `Support link` to Welsh for upload page", async () => {

        const req = await request(app)
            .get(PrefixedUrls.UPLOAD + "?lang=cy");

        expect(req.text).toContain("Dolenni cymorth");
    });
});
