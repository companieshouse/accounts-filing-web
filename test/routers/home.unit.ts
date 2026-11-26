import request from "supertest";
import { PrefixedUrls, servicePathPrefix } from "../../src/utils/constants/urls";
import { loadApp } from "./load.app";
import { App } from "supertest/types";
import { JSDOM } from "jsdom";

describe("home page tests", () => {
    let app: App;

    const resetEnvVariables = () => {
        delete process.env.DISABLE_DORMANT_EXEMPT_SUBSIDIARY_ACCOUNTS_RADIO;
        delete process.env.DISABLE_GROUP_SECTION_400_UK_PARENT_ACCOUNTS_RADIO;
        delete process.env.DISABLE_GROUP_SECTION_401_NON_UK_PARENT_ACCOUNTS_RADIO;
        delete process.env.DISABLE_LIMITED_PARTNERSHIP_ACCOUNTS_RADIO;
        delete process.env.CIC_DISABLE_RADIO;

        process.env.DISABLE_DORMANT_EXEMPT_SUBSIDIARY_ACCOUNTS_RADIO = "false";
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

    it.each([
        {
            language: "en",
            payment: "to pay the fee using a credit or debit card, if relevant",
            heading: "Use suitable software",
            software: "You must use suitable software to prepare the accounts and save them in a ZIP file format. You cannot create the ZIP file manually.",
            findSoftware: "Use our tool if you need to find software for filing company accounts.",
            warning: "If your package accounts have not been prepared using suitable software, they may be rejected.",
            fallback: "Warning",
            prepare: "Preparing your package accounts",
            checks: "The software you use will prepare your package accounts for you. You should not need to do any additional checks.",
            frc: "If you'd like more information, you can find details of all available taxonomies and digital reporting guidance on the Financial Reporting Council (FRC) website.",
        },
        {
            language: "cy",
            payment: "talu'r ffi gan ddefnyddio cerdyn credyd neu ddebyd, os yw'n berthnasol",
            heading: "Defnyddiwch feddalwedd addas",
            software: "Rhaid i chi ddefnyddio meddalwedd addas i baratoi'r cyfrifon a'u cadw ar fformat ffeil ZIP. Ni allwch greu'r ffeil ZIP â llaw.",
            findSoftware: "Defnyddiwch ein teclyn os oes angen i chi ddod o hyd i feddalwedd ar gyfer ffeilio cyfrifon cwmni.",
            warning: "Os nad yw eich cyfrifon pecyn wedi'u paratoi gan ddefnyddio meddalwedd addas, gallent gael eu gwrthod.",
            fallback: "Rhybudd",
            prepare: "Paratoi eich cyfrifon pecyn",
            checks: "Bydd y feddalwedd a ddefnyddiwch yn paratoi eich cyfrifon pecyn i chi. Ni ddylech orfod gwneud unrhyw wiriadau ychwanegol.",
            frc: "Os hoffech gael rhagor o wybodaeth, gallwch ddod o hyd i fanylion yr holl dacsonomegau sydd ar gael a chanllawiau adrodd digidol ar wefan y Cyngor Adrodd Ariannol (FRC).",
        },
    ])("should display software guidance in $language", async ({ language, payment, heading, software, findSoftware, warning, fallback, prepare, checks, frc }) => {
        const resp = await request(app).get(`${servicePathPrefix}?lang=${language}`);
        const document = new JSDOM(resp.text).window.document;
        const text = document.body.textContent!.replace(/\s+/g, " ");

        expect(resp.status).toBe(200);
        for (const content of [payment, heading, software, findSoftware, warning, prepare, checks, frc]) {
            expect(text).toContain(content);
        }
        expect(text.indexOf(payment)).toBeLessThan(text.indexOf(heading));
        expect(text.indexOf(heading)).toBeLessThan(text.indexOf(warning));
        expect(text.indexOf(warning)).toBeLessThan(text.indexOf(prepare));
        expect(Array.from(document.querySelectorAll("h3")).some(element => element.textContent?.trim() === heading)).toBe(true);
        expect(document.querySelector(".govuk-warning-text .govuk-visually-hidden")?.textContent).toBe(fallback);
        const softwareLink = document.querySelector('[data-event-id="package-accounts-start-page-find-software-link"]');
        expect(softwareLink?.getAttribute("href")).toBe("https://www.gov.uk/software-company-accounts");
        expect(softwareLink?.textContent?.endsWith(".")).toBe(false);
        expect(softwareLink?.nextSibling?.textContent?.trim()).toBe(".");
        expect(document.querySelector('[data-event-id="package-accounts-start-page-frc-link"]')?.getAttribute("href"))
            .toBe("https://www.frc.org.uk/library/digital-reporting/digital-reporting-education-outreach/");
        expect(document.querySelector('[data-event-id="package-accounts-start-page-ixbrl-accounts-test-service"]')).toBeNull();
        expect(text).not.toContain("You can check if your accounts files are valid using the");
    });

    it("should render the home page with all accounts text displayed", async () => {
        const url = `${servicePathPrefix}`;
        const resp = await request(app).get(url + "?lang=en");

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

    it("should render overseas accounts and payment guidance when other account types are disabled", async () => {

        process.env.DISABLE_DORMANT_EXEMPT_SUBSIDIARY_ACCOUNTS_RADIO = "true";
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
            expect(resp.text).toContain('overseas companies - there is a £34 fee to file');
            expect(resp.text).not.toContain('limited partnership accounts');
            expect(resp.text).not.toContain('group package accounts - section 401, parent incorporated under non-UK law');
            expect(resp.text).toContain('to pay the fee using a credit or debit card, if relevant');
            expect(resp.text).toContain(PrefixedUrls.BEFORE_YOU_FILE_PACKAGE_ACCOUNTS + "?lang=en");
        });
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
