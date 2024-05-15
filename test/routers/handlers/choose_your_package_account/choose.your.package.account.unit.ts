import express from "express";
import request from "supertest";
import app from "./../../../../src/app";
import { mockSession, resetMockSession } from "../../../mocks/session.middleware.mock";
import { getSessionRequest } from "../../../mocks/session.mock";
import { PrefixedUrls, Urls, servicePathPrefix } from "../../../../src/utils/constants/urls";
import { PackageTypeDetails, getPackageItems } from "../../../../src/utils/constants/PackageTypeDetails";
import { ContextKeys } from "../../../../src/utils/constants/context.keys";


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

    it("should render package selection page with the correct page title", async () => {
        const response = await request(app).get(PrefixedUrls.CHOOSE_YOUR_ACCOUNTS_PACKAGE);
        expect(response.statusCode).toBe(200);
        expect(response.text).toContain(viewDataPackageSelectionPage.title);
    });

    it("should render all package account types on the package page", async () => {
        const response = await request(app).get(PrefixedUrls.CHOOSE_YOUR_ACCOUNTS_PACKAGE);
        expect(response.statusCode).toBe(200);
        getPackageItems().forEach(item => {
            expect(response.text).toContain(item.value);
            expect(response.text).toContain(item.text);

            if (item["hint"]["text"] !== null){
                expect(response.text).toContain(item["hint"]["text"]);
            }
        });
    });

    it("should contain the correct backlink", async () => {
        const backUrl = PrefixedUrls.CONFIRM_COMPANY;
        const response = await request(app).get(PrefixedUrls.CHOOSE_YOUR_ACCOUNTS_PACKAGE);
        expect(response.statusCode).toBe(200);
        expect(response.text).toContain(backUrl);
    });

    it(`should set the package account correctly and redirect to ${Urls.UPLOAD}`, async () => {
        const response = await request(app).post(PrefixedUrls.CHOOSE_YOUR_ACCOUNTS_PACKAGE).send({ value: PackageTypeDetails.overseas.name }).expect(302);
        expect(response.text).toContain(Urls.UPLOAD.substring(1));
    });

    it("should throw a packageAccount error", async () => {
        expect(await request(app).post(PrefixedUrls.CHOOSE_YOUR_ACCOUNTS_PACKAGE).expect(500)).rejects.toThrow;
    });

});
