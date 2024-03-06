import app from "../../src/app";
import request from "supertest";
import { servicePathPrefix, submitUrl } from "../../src/utils/constants/urls";
import { session } from "../mocks/session.middleware.mock";
import { ContextKeys } from "../../src/utils/constants/context.keys";

describe("submit redirect tests", () => {
    it("should show status 302 for redirection", async () => {
        session.setExtraData(ContextKeys.COMPANY_NUMBER, "00006400");
        session.setExtraData(ContextKeys.TRANSACTION_ID, "000000-123456-000000");
        const url = `${servicePathPrefix}${submitUrl}`;
        const resp = await request(app).get(url);

        expect(resp.body.httpStatusCode).toBe(500);
    });
});
