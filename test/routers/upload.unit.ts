import app from "../../src/app";
import request from "supertest";
import { servicePathPrefix, uploadUrl } from "../../src/utils/constants/urls";

describe("upload redirect tests", () => {
    it("should show status 302 for redirection", async () => {
        const url = `${servicePathPrefix}${uploadUrl}`;
        const resp = await request(app).get(url);

        expect(resp.status).toBe(302);
    });
});
