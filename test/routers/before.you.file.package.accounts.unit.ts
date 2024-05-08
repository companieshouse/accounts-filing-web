import app from "../../src/app";
import request from "supertest";
import { PrefixedUrls } from "../../src/utils/constants/urls";


describe("Before you file package accounts test", () => {

    it("Should render the page on get request", async () => {
        const resp = await request(app).get(PrefixedUrls.BEFORE_YOU_FILE_PACKAGE_ACCOUNTS);
        expect(resp.status).toBe(200);
        expect(resp.text).toContain("Before you file package accounts");
    });

});
