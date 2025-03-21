import request from "supertest";
import { PrefixedUrls, servicePathPrefix } from "../../src/utils/constants/urls";
import { loadApp } from "./load.app";

describe("home page tests", () => {
    let app;

    const resetEnvVariables = () => {
        delete process.env.DISABLE_DORMANT_EXEMPT_SUBSIDIARY_ACCOUNTS_RADIO;
        delete process.env.DISABLE_OVERSEAS_COMPANY_ACCOUNTS_RADIO;
        delete process.env.DISABLE_GROUP_SECTION_400_UK_PARENT_ACCOUNTS_RADIO;
        delete process.env.DISABLE_GROUP_SECTION_401_NON_UK_PARENT_ACCOUNTS_RADIO;
        delete process.env.DISABLE_LIMITED_PARTNERSHIP_ACCOUNTS_RADIO;
        delete process.env.CIC_DISABLE_RADIO;

        process.env.DISABLE_DORMANT_EXEMPT_SUBSIDIARY_ACCOUNTS_RADIO = "false";
        process.env.DISABLE_OVERSEAS_COMPANY_ACCOUNTS_RADIO = "false";
        process.env.DISABLE_GROUP_SECTION_400_UK_PARENT_ACCOUNTS_RADIO = "false";
        process.env.DISABLE_GROUP_SECTION_401_NON_UK_PARENT_ACCOUNTS_RADIO = "false";
        process.env.DISABLE_LIMITED_PARTNERSHIP_ACCOUNTS_RADIO = "false";
        process.env.CIC_DISABLE_RADIO = "false";
    };

    beforeEach(() => {
        resetEnvVariables();
        app = loadApp();
    });

    afterEach(() => {
        resetEnvVariables();
    });

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

    it("should render the home page with all accounts text displayed", async () => {
        const url = `${servicePathPrefix}`;
        const resp = await request(app).get(url);

        expect(resp.status).toBe(200);
        expect(resp.text).toContain('UKSEF accounts for listed companies');
        expect(resp.text).toContain('Welsh accounts with an English translation');
        expect(resp.text).toContain('dormant exempt subsidiary accounts');
        expect(resp.text).toContain('group package accounts - section 400, parent incorporated under UK law');
        expect(resp.text).toContain('Community Interest Companies (CIC) - there is a £15 fee to file');
        expect(resp.text).toContain('overseas companies - there is a £34 fee to file');
        expect(resp.text).toContain('limited partnership accounts');
        expect(resp.text).toContain('group package accounts - section 401, parent incorporated under non-UK law');
        expect(resp.text).toContain('to pay the fee using a credit or debit card, if relevant');
        expect(resp.text).toContain(PrefixedUrls.BEFORE_YOU_FILE_PACKAGE_ACCOUNTS + "?lang=en");
    });

    it("should render the home page with only uksef and welsh accounts text displayed", async () => {

        process.env.DISABLE_DORMANT_EXEMPT_SUBSIDIARY_ACCOUNTS_RADIO = "true";
        process.env.DISABLE_OVERSEAS_COMPANY_ACCOUNTS_RADIO = "true";
        process.env.DISABLE_GROUP_SECTION_400_UK_PARENT_ACCOUNTS_RADIO = "true";
        process.env.DISABLE_GROUP_SECTION_401_NON_UK_PARENT_ACCOUNTS_RADIO = "true";
        process.env.DISABLE_LIMITED_PARTNERSHIP_ACCOUNTS_RADIO = "true";
        process.env.CIC_DISABLE_RADIO = "true";
        process.env.DISABLE_WELSH_ACCOUNTS_RADIO = "true";

        const url = `${servicePathPrefix}`;
        jest.isolateModules(async () => {
            app = loadApp();

            const resp = await request(app).get(url);

            expect(resp.status).toBe(200);
            expect(resp.text).toContain('UKSEF accounts for listed companies');
            expect(resp.text).not.toContain('Welsh accounts with an English translation');
            expect(resp.text).not.toContain('dormant exempt subsidiary accounts');
            expect(resp.text).not.toContain('group package accounts - section 400, parent incorporated under UK law');
            expect(resp.text).not.toContain('Community Interest Companies (CIC) - there is a £15 fee to file');
            expect(resp.text).not.toContain('overseas companies - there is a £34 fee to file');
            expect(resp.text).not.toContain('limited partnership accounts');
            expect(resp.text).not.toContain('group package accounts - section 401, parent incorporated under non-UK law');
            expect(resp.text).not.toContain('to pay the fee using a credit or debit card, if relevant');
            expect(resp.text).toContain(PrefixedUrls.BEFORE_YOU_FILE_PACKAGE_ACCOUNTS + "?lang=en");
        });
    });

    it("should display payment text when either cic or overseas enabled", async () => {

        process.env.DISABLE_OVERSEAS_COMPANY_ACCOUNTS_RADIO = ["true", "false"][Math.floor(Math.random() * 2)];
        process.env.CIC_DISABLE_RADIO = (process.env.DISABLE_OVERSEAS_COMPANY_ACCOUNTS_RADIO !== "true").toString();

        const url = `${servicePathPrefix}`;
        app = loadApp();

        const resp = await request(app).get(url);

        expect(resp.status).toBe(200);
        expect(resp.text).toContain(PrefixedUrls.BEFORE_YOU_FILE_PACKAGE_ACCOUNTS + "?lang=en");
        expect(resp.text).toContain('to pay the fee using a credit or debit card, if relevant');
    });

    it("should display 'Continue' when company number in the uri", async () => {

        const url = `${servicePathPrefix}/company/00000000`;

        const resp = await request(app).get(url);

        expect(resp.status).toBe(200);
        expect(resp.text).toMatch(/>[\s]*Continue[\s]*</);
    });

    it("should display 'File package accounts' when without company number in the uri", async () => {

        const url = `${servicePathPrefix}`;

        const resp = await request(app).get(url);

        expect(resp.status).toBe(200);
        expect(resp.text).toMatch(/>[\s]*File package accounts[\s]*</);
    });
});
