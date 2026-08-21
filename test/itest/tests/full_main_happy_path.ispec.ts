import { disable_auth_middleware, disable_company_auth_middleware, disable_csrf_middleware, mockAccountsFilingService, mockGetCompanyProfileResult, mockPostTransactionRecord, mockPutTransaction, set_session_middleware_data } from "../helpers/itest_mocks";
import { RegexString } from "../test_types";
import { ExternalUrlGeneralRegex, getTemplateCompanyProfile, MOCK_ACCOUNT_FILING_ID, MOCK_TRANSACTION, MOCK_TRANSACTION_ID, TEST_COMPANY_NAME, TEST_COMPANY_NUMBER } from "../test_data";
import { ITestPageRequester } from "../helpers/request_helper";
import { assert_has_button_that_sends_post_request, assert_next_page_linked_is, assert_on_post_request_redirects_to, assert_page_loads, assert_page_redirects } from "../helpers/itest_assersions";
import { PrefixedUrls } from "../../../src/utils/constants/urls";
import { getLoggedInSessionWithEmail } from "../../mocks/session.mock";
import { ContextKeys } from "../../../src/utils/constants/context.keys";
import { AccountValidatorResponse } from "@companieshouse/api-sdk-node/dist/services/account-validator/types";


describe("Integration Test: Main Happy Path", () => {
    describe(PrefixedUrls.HOME, () => {
        const page_requester = new ITestPageRequester(PrefixedUrls.HOME, () => {});
        assert_page_loads(page_requester);
        assert_next_page_linked_is(page_requester, PrefixedUrls.BEFORE_YOU_FILE_PACKAGE_ACCOUNTS);
    });
    describe(PrefixedUrls.BEFORE_YOU_FILE_PACKAGE_ACCOUNTS, () => {
        const page_requester = new ITestPageRequester(PrefixedUrls.BEFORE_YOU_FILE_PACKAGE_ACCOUNTS, () => {});
        assert_page_loads(page_requester);
        assert_has_button_that_sends_post_request(page_requester);
        assert_on_post_request_redirects_to(page_requester, `${PrefixedUrls.COMPANY_SEARCH}.*` as RegexString);
    });
    describe(PrefixedUrls.COMPANY_SEARCH, () => {
        const page_requester = new ITestPageRequester(PrefixedUrls.COMPANY_SEARCH, () => {
            disable_csrf_middleware();
        });
        assert_page_redirects(page_requester, ExternalUrlGeneralRegex.COMPANY_LOOKUP);
    });
    describe(PrefixedUrls.CONFIRM_COMPANY, () => {
        // Returned here from /company-lookup/search after login
        // Assert back button returns to company search
        const page_requester = new ITestPageRequester(`${PrefixedUrls.CONFIRM_COMPANY}?companyNumber=01234567`, () => {
            disable_csrf_middleware();
            disable_auth_middleware();
            const session = getLoggedInSessionWithEmail();
            set_session_middleware_data(session);
            mockGetCompanyProfileResult(getTemplateCompanyProfile());
        });
        assert_page_loads(page_requester);
        assert_next_page_linked_is(page_requester, PrefixedUrls.CHOOSE_YOUR_ACCOUNTS_PACKAGE);
    });
    describe(PrefixedUrls.CHOOSE_YOUR_ACCOUNTS_PACKAGE, () => {
        // This throws you back to the authentication service for auth code validation before allowing you to continue the journey
        const page_requester = new ITestPageRequester(PrefixedUrls.CHOOSE_YOUR_ACCOUNTS_PACKAGE, () => {
            disable_csrf_middleware();
            disable_auth_middleware();
            disable_company_auth_middleware();
            const session = getLoggedInSessionWithEmail();
            session.data.signin_info!.company_number = TEST_COMPANY_NUMBER;
            session!.setExtraData(ContextKeys.COMPANY_NUMBER, TEST_COMPANY_NUMBER);
            set_session_middleware_data(session);
            mockGetCompanyProfileResult(getTemplateCompanyProfile());
        });
        assert_page_loads(page_requester);
        assert_has_button_that_sends_post_request(page_requester);
        assert_on_post_request_redirects_to(page_requester, PrefixedUrls.UPLOAD as RegexString, { "package-type": "uksef" });
    });
    describe(PrefixedUrls.UPLOAD, () => {
        const page_requester = new ITestPageRequester(PrefixedUrls.UPLOAD, () => {
            disable_csrf_middleware();
            disable_auth_middleware();
            disable_company_auth_middleware();
            const session = getLoggedInSessionWithEmail();
            session.data.signin_info!.company_number = TEST_COMPANY_NUMBER;
            session!.setExtraData(ContextKeys.COMPANY_NUMBER, TEST_COMPANY_NUMBER);
            session!.setExtraData(ContextKeys.COMPANY_NAME, TEST_COMPANY_NAME);
            session!.setExtraData(ContextKeys.PACKAGE_TYPE, "uksef");
            set_session_middleware_data(session);
            mockGetCompanyProfileResult(getTemplateCompanyProfile());
            mockPostTransactionRecord(MOCK_TRANSACTION);
            mockAccountsFilingService(MOCK_ACCOUNT_FILING_ID);
        });
        assert_page_redirects(page_requester, ExternalUrlGeneralRegex.XBRL_VALIDATE);
    });
    describe(PrefixedUrls.UPLOADED, () => {
        // Returned to from xbrl_validate after document uploaded
        const page_requester = new ITestPageRequester(`${PrefixedUrls.UPLOADED}/${MOCK_ACCOUNT_FILING_ID}`, () => {
            disable_csrf_middleware();
            disable_auth_middleware();
            disable_company_auth_middleware();
            const session = getLoggedInSessionWithEmail();
            session.data.signin_info!.company_number = TEST_COMPANY_NUMBER;
            session!.setExtraData(ContextKeys.COMPANY_NUMBER, TEST_COMPANY_NUMBER);
            session!.setExtraData(ContextKeys.COMPANY_NAME, TEST_COMPANY_NAME);
            session!.setExtraData(ContextKeys.PACKAGE_TYPE, "uksef");
            session!.setExtraData(ContextKeys.ACCOUNTS_FILING_ID, MOCK_ACCOUNT_FILING_ID);
            session!.setExtraData(ContextKeys.TRANSACTION_ID, MOCK_TRANSACTION_ID);
            set_session_middleware_data(session);
            mockGetCompanyProfileResult(getTemplateCompanyProfile());
            mockPostTransactionRecord(MOCK_TRANSACTION);
            mockAccountsFilingService(MOCK_ACCOUNT_FILING_ID);
        });
        assert_page_loads(page_requester);
        assert_next_page_linked_is(page_requester, PrefixedUrls.CHECK_YOUR_ANSWERS);
    });
    describe(PrefixedUrls.CHECK_YOUR_ANSWERS, () => {
        const page_requester = new ITestPageRequester(PrefixedUrls.CHECK_YOUR_ANSWERS, () => {
            disable_csrf_middleware();
            disable_auth_middleware();
            disable_company_auth_middleware();
            const session = getLoggedInSessionWithEmail();
            session.data.signin_info!.company_number = TEST_COMPANY_NUMBER;
            session!.setExtraData(ContextKeys.COMPANY_NUMBER, TEST_COMPANY_NUMBER);
            session!.setExtraData(ContextKeys.COMPANY_NAME, TEST_COMPANY_NAME);
            session!.setExtraData(ContextKeys.PACKAGE_TYPE, "uksef");
            session!.setExtraData(ContextKeys.ACCOUNTS_FILING_ID, MOCK_ACCOUNT_FILING_ID);
            session!.setExtraData(ContextKeys.TRANSACTION_ID, MOCK_TRANSACTION_ID);
            session!.setExtraData(ContextKeys.VALIDATION_STATUS, {} as AccountValidatorResponse);
            set_session_middleware_data(session);
            mockGetCompanyProfileResult(getTemplateCompanyProfile());
            mockPutTransaction(MOCK_TRANSACTION);
            mockAccountsFilingService(MOCK_ACCOUNT_FILING_ID);
        });
        assert_page_loads(page_requester);
        assert_has_button_that_sends_post_request(page_requester);
        assert_on_post_request_redirects_to(page_requester, PrefixedUrls.CONFIRMATION as RegexString);
    });
});
