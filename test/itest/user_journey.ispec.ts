import mockCsrfProtectionMiddleware from "../mocks/csrf.protection.middleware.mock";
import { mockSession, resetMockSession } from "../mocks/session.middleware.mock";
import mockAuthenticationMiddleware from "../mocks/authentication.middleware.mock";

import request from "supertest";
import app from "../../src/app";
import { JSDOM } from 'jsdom';
import { PrefixedUrls } from "../../src/utils/constants/urls";
import { setCookie } from "../routers/helper/requests";
import { ContextKeys } from "../../src/utils/constants/context.keys";
import { getSessionRequest } from "../mocks/session.mock";
import { CompanyProfileService } from "../../src/services/external/company.profile.service";
import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile";
import { TransactionService } from "../../src/services/external/transaction.service";
import { Transaction } from "@companieshouse/api-sdk-node/dist/services/transaction/types";
import { AccountsFilingService } from "../../src/services/external/accounts.filing.service";
import { AccountsFilingCompanyResponse } from "@companieshouse/api-sdk-node/dist/services/accounts-filing/types";
import { AccountValidatorResponse } from "@companieshouse/api-sdk-node/dist/services/account-validator/types";

type PageRequest = { request: request.Agent, page: string }
type regexString = string

describe("Integration Test: Happy Path", () => {
    /* ===================== HELPERS ===================== */
    const assert_page_loads = (page_request: PageRequest) => {
        it("Page Loads", async () => {
            const response = await page_request.request.get(page_request.page).set("Cookie", setCookie());
            expect(response.status).toBe(200);
        });
    };
    const assert_page_redirects = (page_request: PageRequest, expected_redirect_url: regexString) => {
        it(`Page Redirects to '${expected_redirect_url}'`, async () => {
            const response = await page_request.request.get(page_request.page).set("Cookie", setCookie());
            expect(response.status).toBe(302);
            expect(response.headers.location).toMatch(new RegExp(expected_redirect_url));
        });
    };
    const assert_next_page_linked_is = (page_request: PageRequest, expected_next_url: string) => {
        it(`Next linked page is '${expected_next_url}'`, async () => {
            const response = await page_request.request.get(page_request.page).set("Cookie", setCookie());
            expect(response.text).toMatch(new RegExp(`.*href=[^>]+${expected_next_url}.*`));
        });
    };
    const assert_has_button_that_sends_post_request = (page_request: PageRequest) => {
        it(`Page has button which will send POST request`, async () => {
            const response = await page_request.request.get(page_request.page).set("Cookie", setCookie());
            expect(
                new JSDOM(response.text).window.document.querySelector(
                    'form[method="post"] button'
                )
            ).not.toBeNull();
        });
    };
    const assert_on_post_request_redirects_to = (page_request: PageRequest, expected_redirect_url: regexString, form_data: object = {}) => {
        it(`On POST request will redirect to '${expected_redirect_url}'`, async () => {
            const response = await page_request.request.post(page_request.page).set("Cookie", setCookie()).type('form').send(form_data);
            expect(response.status).toBe(302);
            expect(response.headers.location).toMatch(new RegExp(expected_redirect_url));
        });
    };

    /* ==================== TEST CONSTANTS ===================== */
    const company_profile = {
        registeredOfficeAddress: {
            addressLineOne: "Addr ln 1",
            addressLineTwo: "Addr ln 2",
            postalCode: "POSTCODE",
        },
        companyName: "MOCK_COMPANY_NAME",
        companyNumber: "01234567",
        companyStatus: "mock_status",
        dateOfCreation: "2026-01-01",
        type: "uksef",
        accounts: {
            nextAccounts: {
                periodStartOn: "2026-01-02"
            },
            nextDue: "2026-01-03"
        }
    } as CompanyProfile;
    const MOCK_ACCOUNT_FILING_ID = "fake_file_id";
    const MOCK_TRANSACTION_ID = 12345;
    const MOCK_TRANSACTION = { id: MOCK_TRANSACTION_ID } as unknown as Transaction;

    /* ================ GENERAL MIDDLEWARE MOCKING ============= */
    beforeEach(() => {
        jest.clearAllMocks();
        mockCsrfProtectionMiddleware.mockClear();
        resetMockSession();
    });

    /* ===================== JOURNEY TESTS ===================== */
    describe("Journey Section: Logged Out", () => {
        describe(PrefixedUrls.HOME, () => {
            const page_request = { request: request(app), page: PrefixedUrls.HOME };
            assert_page_loads(page_request);
            assert_next_page_linked_is(page_request, PrefixedUrls.BEFORE_YOU_FILE_PACKAGE_ACCOUNTS);
        });
        describe(PrefixedUrls.BEFORE_YOU_FILE_PACKAGE_ACCOUNTS, () => {
            const page_request = { request: request(app), page: PrefixedUrls.BEFORE_YOU_FILE_PACKAGE_ACCOUNTS };
            assert_page_loads(page_request);
            assert_has_button_that_sends_post_request(page_request);
            assert_on_post_request_redirects_to(page_request, `${PrefixedUrls.COMPANY_SEARCH}.*`);
        });
        describe(PrefixedUrls.COMPANY_SEARCH, () => {
            const page_request = { request: request(app), page: PrefixedUrls.COMPANY_SEARCH };
            assert_page_redirects(page_request, `/company-lookup/search.*`);
        });
    });
    describe("Journey Section: Logged In & Company in Scope", () => {
        beforeEach(() => {
            mockAuthenticationMiddleware.mockClear();
            Object.assign(mockSession, getSessionRequest());
            mockSession.data.signin_info!.company_number = company_profile.companyNumber;
            mockSession.data.signin_info!.user_profile!.email = "test@example.com";
            mockSession!.setExtraData(ContextKeys.COMPANY_NUMBER, company_profile.companyNumber);
            mockSession!.setExtraData(ContextKeys.COMPANY_NAME, company_profile.companyNumber);
            mockSession!.setExtraData(ContextKeys.PACKAGE_TYPE, company_profile.type);
            mockSession!.setExtraData(ContextKeys.ACCOUNTS_FILING_ID, MOCK_ACCOUNT_FILING_ID);
            mockSession!.setExtraData(ContextKeys.TRANSACTION_ID, MOCK_TRANSACTION_ID);
            mockSession!.setExtraData(ContextKeys.VALIDATION_STATUS, {} as AccountValidatorResponse);
            // Upload & onward mocks
            jest.spyOn(TransactionService.prototype, 'postTransactionRecord').mockResolvedValue(MOCK_TRANSACTION);
            jest.spyOn(TransactionService.prototype, 'putTransaction').mockResolvedValue({ httpStatusCode: 200, resource: MOCK_TRANSACTION });
            jest.spyOn(AccountsFilingService.prototype, 'checkCompany').mockResolvedValue({
                httpStatusCode: 200,
                resource: {
                    accountsFilingId: MOCK_ACCOUNT_FILING_ID,
                } as AccountsFilingCompanyResponse
            });
            jest.spyOn(AccountsFilingService.prototype, 'setTransactionPackageType').mockImplementation(async (_session) => {});

        });
        describe(PrefixedUrls.CONFIRM_COMPANY, () => {
            // Returned here from /company-lookup/search after login & with a company number available
            beforeEach(() => {
                jest.spyOn(CompanyProfileService.prototype, 'getCompanyProfile').mockResolvedValue(company_profile);
                // Removing data to be set by this page
                mockSession!.deleteExtraData(ContextKeys.COMPANY_NUMBER);
                mockSession!.deleteExtraData(ContextKeys.COMPANY_NAME);
            });
            const page_request = { request: request(app), page: `${PrefixedUrls.CONFIRM_COMPANY}?companyNumber=01234567` };
            assert_page_loads(page_request);
            assert_next_page_linked_is(page_request, PrefixedUrls.CHOOSE_YOUR_ACCOUNTS_PACKAGE);
        });
        describe(PrefixedUrls.CHOOSE_YOUR_ACCOUNTS_PACKAGE, () => {
            // This throws you back to the authentication service for auth code validation before allowing you to continue the journey
            const page_request = { request: request(app), page: PrefixedUrls.CHOOSE_YOUR_ACCOUNTS_PACKAGE };
            assert_page_loads(page_request);
            assert_has_button_that_sends_post_request(page_request);
            assert_on_post_request_redirects_to(page_request, PrefixedUrls.UPLOAD, { "package-type": "uksef" });
        });
        describe(PrefixedUrls.UPLOAD, () => {
            const page_request = { request: request(app), page: PrefixedUrls.UPLOAD };
            assert_page_redirects(page_request, ".*/xbrl_validate/submit.*");
        });
        describe(PrefixedUrls.UPLOADED, () => {
            // Returned to from xbrl_validate after document uploaded
            const page_request = { request: request(app), page: `${PrefixedUrls.UPLOADED}/${MOCK_ACCOUNT_FILING_ID}` };
            assert_page_loads(page_request);
            assert_next_page_linked_is(page_request, PrefixedUrls.CHECK_YOUR_ANSWERS);
        });
        describe(PrefixedUrls.CHECK_YOUR_ANSWERS, () => {
            const page_request = { request: request(app), page: PrefixedUrls.CHECK_YOUR_ANSWERS };
            assert_page_loads(page_request);
            assert_has_button_that_sends_post_request(page_request);
            assert_on_post_request_redirects_to(page_request, PrefixedUrls.CONFIRMATION);
        });
    });

});
