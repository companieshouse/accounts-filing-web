import { mockGetCompanyProfileFn } from "../mocks/company.profile.service.mock";
import app from "../../src/app";
import request from "supertest";
import { PrefixedUrls } from "../../src/utils/constants/urls";
import { mockSession } from "../mocks/session.middleware.mock";
import { getSessionRequest } from "../mocks/session.mock";
import { getCompanyNumberFromExtraData } from "../../src/utils/session";

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
        Object.assign(mockSession, getSessionRequest());
        mockGetCompanyProfileFn.mockResolvedValue({
            company_number: '00006400',
            name: 'Test Company'
        });
    });
    
    it('it should store the company number in the session and route to the select accounts type page', async () => {
        const url = PrefixedUrls.BEFORE_YOU_FILE_PACKAGE_ACCOUNTS_WITH_COMPANY_NUMBER.replace(':companyNumber', '00006400');
        const resp = await request(app).post(url);
        expect(getCompanyNumberFromExtraData(mockSession)).toBe('00006400');
        expect(resp.headers.location).toContain(PrefixedUrls.CHOOSE_YOUR_ACCOUNTS_PACKAGE);
    });
});