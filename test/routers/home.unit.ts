import app from "../../src/app";
import request from "supertest";
import { PrefixedUrls, servicePathPrefix } from "../../src/utils/constants/urls";

describe("home page tests", () => {
    it("should render the home page", async () => {
        const url = `${servicePathPrefix}`;
        const resp = await request(app).get(url);

        expect(resp.status).toBe(200);
        expect(resp.text).toContain(`File package accounts with Companies House`);
        expect(resp.text).toContain(PrefixedUrls.BEFORE_YOU_FILE_PACKAGE_ACCOUNTS + "?lang=en");
    });

    it("should render the home page", async () => {
        const url = `${servicePathPrefix}`;
        const resp = await request(app).get(url + "?lang=en");

        expect(resp.status).toBe(200);
        expect(resp.text).toContain(`File package accounts with Companies House`);
        expect(resp.text).toContain(PrefixedUrls.BEFORE_YOU_FILE_PACKAGE_ACCOUNTS + "?lang=en");
    });

    it("should render the home page in welsh with a query of ?lang=cy", async () => {
        const url = `${servicePathPrefix}`;
        const resp = await request(app).get(url + "?lang=cy");
        expect(resp.status).toBe(200);
        expect(resp.text).toContain(`Ffeilio cyfrifon pecyn  gyda`);
        expect(resp.text).toContain(PrefixedUrls.BEFORE_YOU_FILE_PACKAGE_ACCOUNTS + "?lang=cy");
    });

    it("should render the home page without uksef and welsh accounts text displayed", async () => {
        const url = `${servicePathPrefix}`;
        const resp = await request(app).get(url);

        expect(resp.status).toBe(200);
        expect(resp.text).not.toContain(`UKSEF accounts for listed companies`);
        expect(resp.text).not.toContain(`Welsh accounts with an English translation`);
        expect(resp.text).toContain(PrefixedUrls.BEFORE_YOU_FILE_PACKAGE_ACCOUNTS + "?lang=en");
    });
});
