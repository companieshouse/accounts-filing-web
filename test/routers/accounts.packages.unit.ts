import app from "../../src/app";
import request from "supertest";
import { ACCOUNTS_PACKAGES_URL, servicePathPrefix } from "../../src/utils/constants/urls";

describe("accounts packages page tests", () => {
    it("should render the accounts packages page", async () => {
        const resp = await request(app).get(`${servicePathPrefix}${ACCOUNTS_PACKAGES_URL}`);

        expect(resp.status).toBe(200);
    });
});
