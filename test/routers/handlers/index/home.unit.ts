import app from "../../../../src/app";
import request from "supertest";
import { servicePathPrefix } from "../../../../src/utils/constants/urls";

describe("home page tests", () => {
    it("should render the home page", async () => {
        const resp = await request(app).get(`${servicePathPrefix}/`);

        expect(resp.status).toBe(200);
        expect(resp.text).toContain(`Zip File Accounts Upload Service`);
    });
});
