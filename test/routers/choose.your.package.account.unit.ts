import mockCsrfProtectionMiddleware from "../mocks/csrf.protection.middleware.mock";
import express, { Request } from "express";
import request from "supertest";
import app from "../../src/app";
import { mockSession, resetMockSession } from "../mocks/session.middleware.mock";
import { getSessionRequest } from "../mocks/session.mock";
import { PrefixedUrls, Urls } from "../../src/utils/constants/urls";
import { ContextKeys } from "../../src/utils/constants/context.keys";
import { packageTypeFieldName } from "../../src/routers/handlers/choose_your_package_accounts/constants";
import errorManifest from "../../src/utils/error_manifests/default";
import { getPackageTypeOptionsRadioButtonData } from "../../src/routers/handlers/choose_your_package_accounts/package.type.options";
import { EnvKey, setEnvVars } from "../test_utils";
import { getRequestWithCookie, setCookie } from "./helper/requests";

const viewDataPackageSelectionPage = {
    title: "What package accounts are you submitting?",
    session: {
        companyName: 'Test Company',
        companyNumber: '00006400',
        accountsFilingId: '78910',
        email: "test@test"
    }
};

describe("package account selection test", () => {
    beforeEach(() => {
        Object.assign(mockSession, getSessionRequest());
        mockSession.data.signin_info!.company_number = viewDataPackageSelectionPage.session.companyNumber;
        mockSession.data.signin_info!.user_profile!.email = viewDataPackageSelectionPage.session.email;
        mockSession.setExtraData(ContextKeys.COMPANY_NAME, viewDataPackageSelectionPage.session.companyName);
        mockSession.setExtraData(ContextKeys.ACCOUNTS_FILING_ID, viewDataPackageSelectionPage.session.accountsFilingId);
        mockSession.setExtraData(ContextKeys.COMPANY_NUMBER, viewDataPackageSelectionPage.session.companyNumber);

        app.use(express.json());

        app.use((req, res, next) => {
            req.session = mockSession;
            next();
        });
        mockCsrfProtectionMiddleware.mockClear();
    });

    afterEach(() => {
        resetMockSession();
    });

    it("should render all enabled package account types on the package page", async () => {
        const response = await getRequestWithCookie(PrefixedUrls.CHOOSE_YOUR_ACCOUNTS_PACKAGE);
        expect(response.statusCode).toBe(200);

        for (const button of getPackageTypeOptionsRadioButtonData(response.request as unknown as Request)) {
            expect(response.text).toContain(button.text);
            expect(response.text).toContain(button.value);
            if (button.hint) {
                expect(response.text).toContain(button.hint.text);
            }
        }
    });

    it("should render package selection page with the correct page title", async () => {
        const response = await getRequestWithCookie(PrefixedUrls.CHOOSE_YOUR_ACCOUNTS_PACKAGE);
        expect(response.statusCode).toBe(200);
        expect(response.text).toContain(viewDataPackageSelectionPage.title);
    });

    it("should contain the correct backlink", async () => {
        const backUrl = PrefixedUrls.CONFIRM_COMPANY;
        const response = await getRequestWithCookie(PrefixedUrls.CHOOSE_YOUR_ACCOUNTS_PACKAGE);
        expect(response.statusCode).toBe(200);
        expect(response.text).toContain(backUrl);
    });

    it(`should set the package account correctly and redirect to ${Urls.UPLOAD}`, async () => {
        const response = await request(app).post(PrefixedUrls.CHOOSE_YOUR_ACCOUNTS_PACKAGE).send({ [packageTypeFieldName]: "uksef" }).set("Cookie", setCookie()).expect(302);
        expect(response.text).toContain(PrefixedUrls.UPLOAD);
    });

    it("should throw a packageAccount error", async () => {
        const resp = await request(app).post(PrefixedUrls.CHOOSE_YOUR_ACCOUNTS_PACKAGE).set("Cookie", setCookie());
        expect(resp.text).toContain(errorManifest["package-type"].nothingSelected.summary);
    });

    it("should have the cic option displayed", async () => {
        const response = await getRequestWithCookie(PrefixedUrls.CHOOSE_YOUR_ACCOUNTS_PACKAGE);
        expect(response.text).toContain("cic");
    });

    it("should error if email is not set", async () => {
        mockSession.data.signin_info!.user_profile!.email = undefined;
        const response = await getRequestWithCookie(PrefixedUrls.CHOOSE_YOUR_ACCOUNTS_PACKAGE);
        expect(response.statusCode).toBe(500);
    });

    const disableableOptions: [string, EnvKey, string][] = [
        ["audit-exempt", "DISABLE_AUDIT_EXEMPT_SUBSIDIARY_ACCOUNTS_RADIO", "audit-exempt-subsidiary"],
        ["filing-exempt", "DISABLE_DORMANT_EXEMPT_SUBSIDIARY_ACCOUNTS_RADIO", "filing-exempt-subsidiary"],
        ["overseas", "DISABLE_OVERSEAS_COMPANY_ACCOUNTS_RADIO", "overseas"],
        ["group-package-400", "DISABLE_GROUP_SECTION_400_UK_PARENT_ACCOUNTS_RADIO", "group-package-400"],
        ["group-package-401", "DISABLE_GROUP_SECTION_401_NON_UK_PARENT_ACCOUNTS_RADIO", "group-package-401"],
        ["limited-partnership", "DISABLE_LIMITED_PARTNERSHIP_ACCOUNTS_RADIO", "limited-partnership"]
    ];

    for (const [accountsName, envKey, optionSubString] of disableableOptions) {
        it(`should display ${accountsName} accounts if not disabled`, async () => {
            const cleanup = setEnvVars({
                [envKey]: false,
            });

            const response = await getRequestWithCookie(PrefixedUrls.CHOOSE_YOUR_ACCOUNTS_PACKAGE);
            expect(response.text).toContain(optionSubString);

            cleanup();
        });

        it(`should not display ${accountsName} accounts if disabled`, async () => {
            const cleanup = setEnvVars({
                [envKey]: true,
            });

            const response = await getRequestWithCookie(PrefixedUrls.CHOOSE_YOUR_ACCOUNTS_PACKAGE);
            expect(response.text).not.toContain(optionSubString);

            cleanup();
        });
    }

});

describe("Welsh translation", () => {

    beforeEach(() => {
        Object.assign(mockSession, getSessionRequest());
        mockSession.data.signin_info!.company_number = viewDataPackageSelectionPage.session.companyNumber;
        mockSession.data.signin_info!.user_profile!.email = viewDataPackageSelectionPage.session.email;
        mockSession.setExtraData(ContextKeys.COMPANY_NAME, viewDataPackageSelectionPage.session.companyName);
        mockSession.setExtraData(ContextKeys.ACCOUNTS_FILING_ID, viewDataPackageSelectionPage.session.accountsFilingId);
        mockSession.setExtraData(ContextKeys.COMPANY_NUMBER, viewDataPackageSelectionPage.session.companyNumber);

        app.use(express.json());

        app.use((req, res, next) => {
            req.session = mockSession;
            next();
        });
        mockCsrfProtectionMiddleware.mockClear();
    });

    afterEach(() => {
        resetMockSession();
    });
    it("should translate `Support link` to Welsh for chooseYourPackageAccounts page", async () => {

        const req = await getRequestWithCookie(PrefixedUrls.CHOOSE_YOUR_ACCOUNTS_PACKAGE + "?lang=cy");

        expect(req.text).toContain("Dolenni cymorth");
    });

    it("should throw a packageAccount error in Welsh", async () => {
        const resp = await request(app).post(PrefixedUrls.CHOOSE_YOUR_ACCOUNTS_PACKAGE + "?lang=cy").set("Cookie", setCookie());
        expect(resp.text).toContain("Dewiswch y math o gyfrifon pecyn rydych chi&#39;n eu llwytho i fyny");
        expect(resp.text).toContain("Mae yna broblem");
    });

    it("should display 'Confirm and continue' button in Welsh", async () => {
        const resp = await getRequestWithCookie(PrefixedUrls.CHOOSE_YOUR_ACCOUNTS_PACKAGE + "?lang=cy");
        expect(resp.text).toContain("Cadarnhau a pharhau");
    });

    it("should translate page into Welsh", async () => {
        const resp = await getRequestWithCookie(PrefixedUrls.CHOOSE_YOUR_ACCOUNTS_PACKAGE + "?lang=cy");
        expect(resp.text).toContain("Cadarnhau a pharhau");
        expect(resp.text).toContain(`Mae ffi o £33 i&#39;w ffeilio.`);
        expect(resp.text).toContain(`Mae ffi o £15 i&#39;w ffeilio.`);
        expect(resp.text).toContain(`Cyfrifon cwmnïau tramor`);
        expect(resp.text).toContain(`Cyfrifon atodol wedi eu heithrio rhag archwiliad ariannol`);
        expect(resp.text).toContain(`Cyfrifon segur atodol wedi eu heithrio rhag archwiliad ariannol`);
        expect(resp.text).toContain(`Cyfrifon partneriaeth cyfyngedig`);
        expect(resp.text).toContain(`Cyfrifon UKSEF am gwmnïau rhestredig`);
        expect(resp.text).toContain(`Cyfrifon pecyn grŵp-Rhan 400, rhiant wedi eu corffori o dan gyfraith y DU`);
        expect(resp.text).toContain(`Cyfrifon pecyn grŵp-Rhan 401, rhiant wedi eu corffori o dan gyfrraith y tu allan i&#39;r DU`);
        expect(resp.text).toContain(`Cyfrifon Cymraeg gyda chyfieithiad Saesneg`);
    });

    it("should error if email is not set", async () => {
        mockSession.data.signin_info!.user_profile!.email = undefined;
        const response = await getRequestWithCookie(PrefixedUrls.CHOOSE_YOUR_ACCOUNTS_PACKAGE);
        expect(response.statusCode).toBe(500);
    });

});
