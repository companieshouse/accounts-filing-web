import app from "../../src/app";
import request from "supertest";
import { servicePathPrefix, submitUrl } from "../../src/utils/constants/urls";

describe("submit redirect tests", () => {
    it("should show status 302 for redirection", async () => {
        const url = `${servicePathPrefix}${submitUrl}`;
        const resp = await request(app).get(url);

        expect(resp.status).toBe(302);
    });
});
