
import { COMPANY_SEARCH, servicePathPrefix } from "../../src/utils/constants/urls";
import app from "../../src/app";
import request from "supertest";

describe("company search router", () => {
    it("should show status 302", async () => {
        const url = `${servicePathPrefix}${COMPANY_SEARCH}`;
        const resp = await request(app).get(url);

        expect(resp.status).toBe(302);
    });
});
