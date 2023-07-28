import app from "../../src/app";
import request from "supertest";
import { servicePathPrefix, healthcheckUrl } from "../../src/utils/constants/urls";

describe("healthcheck tests", () => {
    it("should show status 200", async () => {
        const url = `${servicePathPrefix}${healthcheckUrl}`;
        const resp = await request(app).get(url);

        expect(resp.status).toBe(200);
    });
});
