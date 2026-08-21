
import { Session } from "@companieshouse/node-session-handler";
import { PrefixedUrls } from "../../../src/utils/constants/urls";
import { assert_has_button_that_sends_post_request, assert_on_post_request_redirects_to, assert_page_loads } from "../helpers/itest_assersions";
import { disable_auth_middleware, disable_company_auth_middleware, disable_csrf_middleware, mockCloseTransaction, mockPaymentService, mockPutTransaction, set_session_middleware_data } from "../helpers/itest_mocks";
import { session_itest_append_company_profile_data, session_itest_append_package_type, session_itest_append_pre_upload_data, session_itest_append_validation_result, session_itest_fully_clear_session, session_itest_overwrite_session_login } from "../helpers/itest_session_data_helpers";
import { ITestPageRequester } from "../helpers/request_helper";
import { MOCK_ACCOUNT_FILING_ID, MOCK_PAYMENT_URL, MOCK_PAYMENT_URL_RESPONSE, MOCK_TRANSACTION, MOCK_TRANSACTION_ID, MOCK_VALIDATION_RESPONSE, TEST_COMPANY_NAME, TEST_COMPANY_NUMBER } from "../test_data";
import { RegexString } from "../test_types";


describe("Integration Test: CHS start -> intercept main journey", () => {
    const session = new Session();
    beforeEach(() => {
        session_itest_fully_clear_session(session);
    });

    describe(PrefixedUrls.CHECK_YOUR_ANSWERS, () => {
        const page_requester = new ITestPageRequester(PrefixedUrls.CHECK_YOUR_ANSWERS, () => {
            disable_csrf_middleware();
            disable_auth_middleware();
            disable_company_auth_middleware();
            set_session_middleware_data(session);
            mockPutTransaction(MOCK_TRANSACTION);
            mockCloseTransaction(MOCK_PAYMENT_URL);
            mockPaymentService(MOCK_PAYMENT_URL_RESPONSE);
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
        assert_on_post_request_redirects_to(page_requester, MOCK_PAYMENT_URL as RegexString);
    });
});
