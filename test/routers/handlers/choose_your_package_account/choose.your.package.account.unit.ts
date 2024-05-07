import express from "express";
import request from "supertest";
import app from "./../../../../src/app";
import { mockSession, resetMockSession } from "../../../mocks/session.middleware.mock";
import { getSessionRequest } from "../../../mocks/session.mock";
import { PrefixedUrls } from "../../../../src/utils/constants/urls";
import { PackageAccounts, getPackageItems } from "../../../../src/utils/constants/packageAccounts";


const viewDataPackageSelectionPage = {
    title: "What package accounts are you submitting?",
    session: {
        companyNumber: '00006400'
    }
};

describe("package account selection test", () => {
    beforeEach(() => {
        Object.assign(mockSession, getSessionRequest());
        mockSession.data.signin_info!.company_number = viewDataPackageSelectionPage.session.companyNumber;
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
        const response = await request(app).get(PrefixedUrls.CHOOSE_YOUR_ACCOUNT_PACKAGE);
        expect(response.statusCode).toBe(200);
        expect(response.text).toContain(viewDataPackageSelectionPage.title);
    });

    it("should render all package account types on the package page", async () => {
        const response = await request(app).get(PrefixedUrls.CHOOSE_YOUR_ACCOUNT_PACKAGE);
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
        const response = await request(app).get(PrefixedUrls.CHOOSE_YOUR_ACCOUNT_PACKAGE);
        expect(response.statusCode).toBe(200);
        expect(response.text).toContain(`${PrefixedUrls.CONFIRM_COMPANY}?companyNumber=${viewDataPackageSelectionPage.session.companyNumber}`);
    });

    it("should set the package account correctly", async () => {
        const response = await request(app).post(PrefixedUrls.CHOOSE_YOUR_ACCOUNT_PACKAGE).send({value: PackageAccounts.overseas.name}).expect(302);
    });

});
