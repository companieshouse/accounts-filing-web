import app from "../../src/app";
import request from "supertest";
import { servicePathPrefix } from "../../src/utils/constants/urls";

describe("home page tests", () => {
    it("should render the home page", async () => {
        const url = `${servicePathPrefix}`;
        const resp = await request(app).get(url);

        expect(resp.status).toBe(200);
        expect(resp.text).toContain(`File package accounts with Companies House`);
    });
});
