import { disable_auth_middleware, disable_company_auth_middleware, disable_csrf_middleware, mockAccountsFilingService, mockGetCompanyProfileResult, mockPostTransactionRecord, mockPutTransaction, set_session_middleware_data } from "../helpers/itest_mocks";
import { RegexString } from "../test_types";
import { ExternalUrlGeneralRegex, getTemplateCompanyProfile, MOCK_ACCOUNT_FILING_ID, MOCK_TRANSACTION, MOCK_TRANSACTION_ID, MOCK_VALIDATION_RESPONSE, TEST_COMPANY_NAME, TEST_COMPANY_NUMBER } from "../test_data";
import { ITestPageRequester } from "../helpers/request_helper";
import { assert_after_get_session_contains_extra_data, assert_after_post_session_contains_extra_data, assert_back_button_link_is, assert_has_button_that_sends_post_request, assert_next_page_linked_is, assert_on_post_request_redirects_to, assert_page_loads, assert_page_redirects } from "../helpers/itest_assersions";
import { PrefixedUrls } from "../../../src/utils/constants/urls";
import { session_itest_append_company_profile_data, session_itest_fully_clear_session, session_itest_overwrite_session_login, session_itest_append_package_type, session_itest_append_pre_upload_data, session_itest_append_validation_result } from "../helpers/itest_session_data_helpers";
import { Session } from "@companieshouse/node-session-handler";
import { ContextKeys } from "../../../src/utils/constants/context.keys";


describe("Integration Test: Main Happy Path", () => {
    const session = new Session();
    beforeEach(() => {
        session_itest_fully_clear_session(session);
    });

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
        const page_requester = new ITestPageRequester(`${PrefixedUrls.CONFIRM_COMPANY}?companyNumber=01234567`, () => {
            disable_csrf_middleware();
            disable_auth_middleware();
            set_session_middleware_data(session);
            mockGetCompanyProfileResult(getTemplateCompanyProfile());
        });
        beforeEach(() => {
            session_itest_overwrite_session_login(session);
        });

        assert_page_loads(page_requester);
        assert_next_page_linked_is(page_requester, PrefixedUrls.CHOOSE_YOUR_ACCOUNTS_PACKAGE);
        assert_back_button_link_is(page_requester, PrefixedUrls.COMPANY_SEARCH);

        assert_after_get_session_contains_extra_data(page_requester, session, ContextKeys.COMPANY_NUMBER, TEST_COMPANY_NUMBER);
        assert_after_get_session_contains_extra_data(page_requester, session, ContextKeys.COMPANY_NAME, TEST_COMPANY_NAME);
    });
    describe(PrefixedUrls.CHOOSE_YOUR_ACCOUNTS_PACKAGE, () => {
        // This throws you back to the authentication service for auth code validation before allowing you to continue the journey
        const page_requester = new ITestPageRequester(PrefixedUrls.CHOOSE_YOUR_ACCOUNTS_PACKAGE, () => {
            disable_csrf_middleware();
            disable_auth_middleware();
            disable_company_auth_middleware();
            set_session_middleware_data(session);
            mockGetCompanyProfileResult(getTemplateCompanyProfile());
        });
        beforeEach(() => {
            session_itest_overwrite_session_login(session);
            session_itest_append_company_profile_data(session, TEST_COMPANY_NUMBER, TEST_COMPANY_NAME);
        });

        assert_page_loads(page_requester);
        assert_has_button_that_sends_post_request(page_requester);
        assert_on_post_request_redirects_to(page_requester, PrefixedUrls.UPLOAD as RegexString, { "package-type": "uksef" });

        assert_after_post_session_contains_extra_data(page_requester, session, ContextKeys.PACKAGE_TYPE, "uksef", { "package-type": "uksef" });
    });
    describe(PrefixedUrls.UPLOAD, () => {
        const page_requester = new ITestPageRequester(PrefixedUrls.UPLOAD, () => {
            disable_csrf_middleware();
            disable_auth_middleware();
            disable_company_auth_middleware();
            set_session_middleware_data(session);
            mockGetCompanyProfileResult(getTemplateCompanyProfile());
            mockPostTransactionRecord(MOCK_TRANSACTION);
            mockAccountsFilingService(MOCK_ACCOUNT_FILING_ID);
        });
        beforeEach(() => {
            session_itest_overwrite_session_login(session);
            session_itest_append_company_profile_data(session, TEST_COMPANY_NUMBER, TEST_COMPANY_NAME);
            session_itest_append_package_type(session, "uksef");
        });

        assert_page_redirects(page_requester, ExternalUrlGeneralRegex.XBRL_VALIDATE);

        assert_after_get_session_contains_extra_data(page_requester, session, ContextKeys.TRANSACTION_ID, MOCK_TRANSACTION_ID);
        assert_after_get_session_contains_extra_data(page_requester, session, ContextKeys.ACCOUNTS_FILING_ID, MOCK_ACCOUNT_FILING_ID);
    });
    describe(PrefixedUrls.UPLOADED, () => {
        // Returned to from xbrl_validate after document uploaded
        const page_requester = new ITestPageRequester(`${PrefixedUrls.UPLOADED}/${MOCK_ACCOUNT_FILING_ID}`, () => {
            disable_csrf_middleware();
            disable_auth_middleware();
            disable_company_auth_middleware();
            set_session_middleware_data(session);
            mockGetCompanyProfileResult(getTemplateCompanyProfile());
            mockPostTransactionRecord(MOCK_TRANSACTION);
            mockAccountsFilingService(MOCK_ACCOUNT_FILING_ID);
        });
        beforeEach(() => {
            session_itest_overwrite_session_login(session);
            session_itest_append_company_profile_data(session, TEST_COMPANY_NUMBER, TEST_COMPANY_NAME);
            session_itest_append_package_type(session, "uksef");
            session_itest_append_pre_upload_data(session, MOCK_TRANSACTION_ID, MOCK_ACCOUNT_FILING_ID);
        });

        assert_page_loads(page_requester);
        assert_next_page_linked_is(page_requester, PrefixedUrls.CHECK_YOUR_ANSWERS);
        assert_back_button_link_is(page_requester, ExternalUrlGeneralRegex.XBRL_VALIDATE);

        assert_after_get_session_contains_extra_data(page_requester, session, ContextKeys.VALIDATION_STATUS, { "__proof_of_object_identity_key": "mock_validation_status" });
    });
    describe(PrefixedUrls.CHECK_YOUR_ANSWERS, () => {
        const page_requester = new ITestPageRequester(PrefixedUrls.CHECK_YOUR_ANSWERS, () => {
            disable_csrf_middleware();
            disable_auth_middleware();
            disable_company_auth_middleware();
            set_session_middleware_data(session);
            mockGetCompanyProfileResult(getTemplateCompanyProfile());
            mockPutTransaction(MOCK_TRANSACTION);
            mockAccountsFilingService(MOCK_ACCOUNT_FILING_ID);
        });
        beforeEach(() => {
            session_itest_overwrite_session_login(session);
            session_itest_append_company_profile_data(session, TEST_COMPANY_NUMBER, TEST_COMPANY_NAME);
            session_itest_append_package_type(session, "uksef");
            session_itest_append_pre_upload_data(session, MOCK_TRANSACTION_ID, MOCK_ACCOUNT_FILING_ID);
            session_itest_append_validation_result(session, { ...MOCK_VALIDATION_RESPONSE });
        });

        assert_page_loads(page_requester);
        assert_has_button_that_sends_post_request(page_requester);
        assert_on_post_request_redirects_to(page_requester, PrefixedUrls.CONFIRMATION as RegexString);
    });
});
