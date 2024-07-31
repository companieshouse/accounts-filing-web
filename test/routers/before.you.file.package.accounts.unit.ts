import app from "../../src/app";
import request from "supertest";
import { PrefixedUrls } from "../../src/utils/constants/urls";

describe("Before you file package accounts test", () => {
    it("Should render the page on get request", async () => {
        const resp = await request(app).get(PrefixedUrls.BEFORE_YOU_FILE_PACKAGE_ACCOUNTS);
        expect(resp.status).toBe(200);
        expect(resp.text).toContain("Before you file package accounts");
    });
    it("Should render the page on get request", async () => {
        const resp = await request(app).get(PrefixedUrls.BEFORE_YOU_FILE_PACKAGE_ACCOUNTS + "?lang=en");
        expect(resp.status).toBe(200);
        expect(resp.text).toContain("Before you file package accounts");
    });
});

describe("Welsh translation", () => {
    it("should translate `Support link` to Welsh for beforeYouFilePackageAccounts page", async () => {
        const resp = await request(app).get(PrefixedUrls.BEFORE_YOU_FILE_PACKAGE_ACCOUNTS + "?lang=cy");
        expect(resp.text).toContain("Cyn i chi ffeiio cyfrifon pecyn");
    });
});
