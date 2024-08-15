import express from "express";
import request from "supertest";
import app from "../../src/app";
import { mockSession, resetMockSession } from "../mocks/session.middleware.mock";
import { getSessionRequest } from "../mocks/session.mock";
import { PrefixedUrls, Urls } from "../../src/utils/constants/urls";
import { ContextKeys } from "../../src/utils/constants/context.keys";
import { packageTypeFieldName } from "../../src/routers/handlers/choose_your_package_accounts/constants";
import errorManifest from "../../src/utils/error_manifests/default";
import { getPackageTypeOptionsRadioButtonData, packageTypeOption, packageTypeOptions } from "../../src/routers/handlers/choose_your_package_accounts/package.type.options";


const viewDataPackageSelectionPage = {
    title: "What package accounts are you submitting?",
    session: {
        companyName: 'Test Company',
        companyNumber: '00006400',
        accountsFilingId: '78910'
    }
};

describe("package account selection test", () => {
    beforeEach(() => {
        Object.assign(mockSession, getSessionRequest());
        mockSession.data.signin_info!.company_number = viewDataPackageSelectionPage.session.companyNumber;
        mockSession.setExtraData(ContextKeys.COMPANY_NAME, viewDataPackageSelectionPage.session.companyName);
        mockSession.setExtraData(ContextKeys.ACCOUNTS_FILING_ID, viewDataPackageSelectionPage.session.accountsFilingId);
        mockSession.setExtraData(ContextKeys.COMPANY_NUMBER, viewDataPackageSelectionPage.session.companyNumber);

        app.use(express.json());

        app.use((req, res, next) => {
            req.session = mockSession;
            next();
        });
    });

    afterEach(() => {
        resetMockSession();
    });

    it("should render all enabled package account types on the package page", async () => {
        const response = await request(app).get(PrefixedUrls.CHOOSE_YOUR_ACCOUNTS_PACKAGE);
        expect(response.statusCode).toBe(200);

        for (const button of getPackageTypeOptionsRadioButtonData()) {
            expect(response.text).toContain(button.text);
            expect(response.text).toContain(button.value);
            if (button.hint) {
                expect(response.text).toContain(button.hint.text);
            }
        }
    });

    it("should render package selection page with the correct page title", async () => {
        const response = await request(app).get(PrefixedUrls.CHOOSE_YOUR_ACCOUNTS_PACKAGE);
        expect(response.statusCode).toBe(200);
        expect(response.text).toContain(viewDataPackageSelectionPage.title);
    });

    it("should contain the correct backlink", async () => {
        const backUrl = PrefixedUrls.CONFIRM_COMPANY;
        const response = await request(app).get(PrefixedUrls.CHOOSE_YOUR_ACCOUNTS_PACKAGE);
        expect(response.statusCode).toBe(200);
        expect(response.text).toContain(backUrl);
    });

    it(`should set the package account correctly and redirect to ${Urls.UPLOAD}`, async () => {
        const response = await request(app).post(PrefixedUrls.CHOOSE_YOUR_ACCOUNTS_PACKAGE).send({ [packageTypeFieldName]: packageTypeOption('overseas').name }).expect(302);
        expect(response.text).toContain(PrefixedUrls.UPLOAD);
    });

    it("should throw a packageAccount error", async () => {
        const resp = await request(app).post(PrefixedUrls.CHOOSE_YOUR_ACCOUNTS_PACKAGE);
        expect(resp.text).toContain(errorManifest["package-type"].nothingSelected.summary);
    });

    it("should throw a packageAccount error in Welsh", async () => {
        const resp = await request(app).post(PrefixedUrls.CHOOSE_YOUR_ACCOUNTS_PACKAGE + "?lang=cy");
        expect(resp.text).toContain("Dewiswch y math o gyfrifon pecyn rydych chi&#39;n eu llwytho i fyny");
    });

    it("should have the cic option displayed", async () => {
        const response = await request(app).get(PrefixedUrls.CHOOSE_YOUR_ACCOUNTS_PACKAGE);
        expect(response.text).toContain(packageTypeOptions[0].name);
    });

});

describe("Welsh translation", () => {
    it("should translate `Support link` to Welsh for chooseYourPackageAccounts page", async () => {

        const req = await request(app)
            .get(PrefixedUrls.CHOOSE_YOUR_ACCOUNTS_PACKAGE + "?lang=cy");

        expect(req.text).toContain("Dolenni cymorth");
    });
});
