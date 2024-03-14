import app from "../../src/app";
import request from "supertest";
import { PrefixedUrls } from "../../src/utils/constants/urls";

describe("healthcheck tests", () => {
    it("should show status 200", async () => {
        const resp = await request(app).get(PrefixedUrls.HEALTHCHECK);

        expect(resp.status).toBe(200);
    });
});
