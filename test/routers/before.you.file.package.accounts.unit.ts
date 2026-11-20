import { mockGetCompanyProfileFn } from "../mocks/company.profile.service.mock";
import app from "../../src/app";
import request from "supertest";
import { PrefixedUrls } from "../../src/utils/constants/urls";
import { mockSession } from "../mocks/session.middleware.mock";
import { getLoggedInSession } from "../mocks/session.mock";
import { getCompanyNumberFromExtraData, setExtraDataCompanyNumber } from "../../src/utils/session";
import { JSDOM } from "jsdom";

const confirmationError = "Select to confirm if you prepared the accounts using suitable software and have saved them in a ZIP file format.";

describe("Before you file package accounts test", () => {
    it("Should render the page on get request", async () => {
        const resp = await request(app).get(PrefixedUrls.BEFORE_YOU_FILE_PACKAGE_ACCOUNTS);
        expect(resp.status).toBe(200);
        expect(resp.text).toContain("Before you file package accounts");
        expect(resp.text).not.toContain(confirmationError);
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
        expect(resp.text).toContain("Cyn i chi ffeilio cyfrifon pecyn");
    });
});

describe("Welsh Cookie translation", () => {
    it("should translate `Cookies on Companies House services` to Welsh for beforeYouFilePackageAccounts page", async() => {
        const resp = await request(app).get(PrefixedUrls.BEFORE_YOU_FILE_PACKAGE_ACCOUNTS + "?lang=cy");
        expect(resp.text).toContain("Cwcis ar wasanaethau Tŷ&#39;r Cwmnïau");
    });
});

describe("Welsh Cookie translation", () => {
    it("should have `Cookies on Companies House services` beforeYouFilePackageAccounts page", async() => {
        const resp = await request(app).get(PrefixedUrls.BEFORE_YOU_FILE_PACKAGE_ACCOUNTS + "?lang=en");
        expect(resp.text).toContain("Cookies on Companies House services");
    });
});


describe("CHS route tests", () => {
    beforeEach(async () => {
        mockGetCompanyProfileFn.mockClear();
        Object.assign(mockSession, getLoggedInSession());
        mockGetCompanyProfileFn.mockResolvedValue({
            company_number: '00006400',
            name: 'Test Company'
        });
    });

    it('it should store the company number in the session and route to the select accounts type page', async () => {
        const url = PrefixedUrls.BEFORE_YOU_FILE_PACKAGE_ACCOUNTS_WITH_COMPANY_NUMBER.replace(':companyNumber', '00006400');
        const resp = await request(app).post(url).type("form").send({ "confirm-software": "true" });
        expect(getCompanyNumberFromExtraData(mockSession)).toBe('00006400');
        expect(resp.headers.location).toContain(PrefixedUrls.CHOOSE_YOUR_ACCOUNTS_PACKAGE);
    });

    it.each([
        PrefixedUrls.BEFORE_YOU_FILE_PACKAGE_ACCOUNTS,
        PrefixedUrls.BEFORE_YOU_FILE_PACKAGE_ACCOUNTS_WITH_COMPANY_NUMBER.replace(':companyNumber', '00006400')
    ])("should show an accessible error below the unchecked checkbox at %s without starting the journey", async (url) => {
        setExtraDataCompanyNumber(mockSession, "01234567");
        const resp = await request(app).post(url);
        const document = new JSDOM(resp.text).window.document;
        const checkbox = document.querySelector("#confirm-software");
        const error = document.querySelector("#confirm-software-error");

        expect(resp.status).toBe(200);
        expect(resp.headers.location).toBeUndefined();
        expect(error?.textContent).toContain(confirmationError);
        expect(error?.classList.contains("govuk-error-message")).toBe(true);
        expect(checkbox?.compareDocumentPosition(error!)).toBe(4);
        expect(checkbox?.closest("fieldset")?.getAttribute("aria-describedby")).toContain("confirm-software-error");
        expect(document.querySelector('.govuk-error-summary a')?.getAttribute("href")).toBe("#confirm-software-error");
        expect(getCompanyNumberFromExtraData(mockSession)).toBe("01234567");
        expect(mockGetCompanyProfileFn).not.toHaveBeenCalled();
    });

    it.each(["false", ["true", "false"]])("should reject an invalid confirmation value %j", async (confirmation) => {
        const url = PrefixedUrls.BEFORE_YOU_FILE_PACKAGE_ACCOUNTS_WITH_COMPANY_NUMBER.replace(':companyNumber', '00006400');
        const resp = await request(app).post(url).type("form").send({ "confirm-software": confirmation });

        expect(resp.status).toBe(200);
        expect(resp.text).toContain(confirmationError);
        expect(mockGetCompanyProfileFn).not.toHaveBeenCalled();
    });

    it("should show the confirmation error in Welsh", async () => {
        const resp = await request(app).post(PrefixedUrls.BEFORE_YOU_FILE_PACKAGE_ACCOUNTS + "?lang=cy");
        const document = new JSDOM(resp.text).window.document;

        expect(resp.status).toBe(200);
        expect(document.querySelector("#confirm-software-error")?.textContent).toContain(
            "Dewiswch i gadarnhau eich bod wedi paratoi'r cyfrifon gan ddefnyddio meddalwedd addas a'ch bod wedi'u cadw mewn fformat ffeil ZIP."
        );
        expect(document.querySelector('label[for="confirm-software"]')?.textContent).toContain(
            "Rwy'n cadarnhau"
        );
    });

    it("should retain the company search redirect when confirmed without a company number", async () => {
        const resp = await request(app).post(PrefixedUrls.BEFORE_YOU_FILE_PACKAGE_ACCOUNTS)
            .type("form").send({ "confirm-software": "true" });

        expect(resp.status).toBe(302);
        expect(resp.headers.location).toContain(PrefixedUrls.COMPANY_SEARCH);
    });
});
