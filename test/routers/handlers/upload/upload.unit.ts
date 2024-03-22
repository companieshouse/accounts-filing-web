import { mockTranactionService } from "../../../mocks/transaction.service.mock";
import { mockDefaultAccountsFilingService } from "../../../mocks/accounts.filing.service.mock";
import { mockSession, resetMockSession } from "../../../mocks/session.middleware.mock";
import { getSessionRequest } from "../../../mocks/session.mock";
import request from "supertest";
import app from "../../../../src/app";
import { PrefixedUrls } from "../../../../src/utils/constants/urls";

describe("company auth test", () => {
    beforeEach(() => {
        jest.clearAllMocks();

    });

    afterEach(() => {
        resetMockSession();
    });

    it("does not redirect to company auth when the companyNumber query parameter checks session companyNumber", async () => {

        Object.assign(mockSession, getSessionRequest());

        mockTranactionService.postTransactionRecord.mockResolvedValue({ id: "1" });
        mockDefaultAccountsFilingService.checkCompany.mockResolvedValue({
            httpStatusCode: 200,
            resource: {
                accountsFilingId: "1"
            }
        });

        mockSession.data.signin_info!.company_number = "00000000";

        const resp = await request(app).get(`${PrefixedUrls.UPLOAD}/?companyNumber=00000000`);
        expect(resp.statusCode).toEqual(302);
        expect(resp.headers["location"]).toContain("xbrl_validate");
    });

    it("redirect to company auth when there is not companyNumber in session", async () => {
        await request(app).get(`${PrefixedUrls.UPLOAD}/?companyNumber=00000000`).expect(302);
    });

    it("redirect to company auth when the companyNumber query parameter does not match what is in the session", async () => {
        // @ts-expect-error because signin_info read only
        mockSession.data.signin_info?.company_number = "NO";

        await request(app).get(`${PrefixedUrls.UPLOAD}/?companyNumber=00000000`).expect(302);
    });

});
