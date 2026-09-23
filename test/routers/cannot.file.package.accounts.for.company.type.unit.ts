import mockCsrfProtectionMiddleware from "../mocks/csrf.protection.middleware.mock";
import { PrefixedUrls } from "../../src/utils/constants/urls";
import { setCookie } from "./helper/requests";
import request from "supertest";
import app from "../../src/app";
import { mockSession } from "../mocks/session.middleware.mock";
import { getLoggedInSession } from "../mocks/session.mock";
import { ContextKeys } from "../../src/utils/constants/context.keys";

describe("cannot file full accounts for company type page", () => {
    beforeEach(() => {
        mockCsrfProtectionMiddleware.mockClear();
    });

    it("should render stop page with required content and guidance link", async () => {
        Object.assign(mockSession, getLoggedInSession());
        mockSession.data.signin_info!.company_number = "BR123456";
        mockSession.setExtraData(ContextKeys.COMPANY_NUMBER, "BR123456");

        const response = await request.agent(app).set("Cookie", setCookie()).get(PrefixedUrls.CANNOT_FILE_PACKAGE_ACCOUNTS_FOR_COMPANY_TYPE);

        expect(response.statusCode).toBe(200);
        expect(response.text).toContain("cannot file package accounts");
        expect(response.text).toContain("https://www.gov.uk/file-accounts-in-the-uk-as-an-overseas-company");
    });
});
