import { Session } from "@companieshouse/node-session-handler";
import { ContextKeys } from "../../../src/utils/constants/context.keys";
import { PrefixedUrls } from "../../../src/utils/constants/urls";
import { assert_after_post_session_contains_extra_data, assert_has_button_that_sends_post_request, assert_next_page_linked_is, assert_on_post_request_redirects_to, assert_page_loads } from "../helpers/itest_assersions";
import { disable_auth_middleware, disable_csrf_middleware, mockGetCompanyProfileResult, set_session_middleware_data } from "../helpers/itest_mocks";
import { session_itest_fully_clear_session, session_itest_overwrite_session_login } from "../helpers/itest_session_data_helpers";
import { ITestPageRequester } from "../helpers/request_helper";
import { getTemplateCompanyProfile, TEST_COMPANY_NAME, TEST_COMPANY_NUMBER } from "../test_data";
import { RegexString } from "../test_types";


describe("Integration Test: CHS start -> intercept main journey", () => {
    const session = new Session();
    beforeEach(() => {
        session_itest_fully_clear_session(session);
    });

    describe(PrefixedUrls.HOME_WITH_COMPANY_NUMBER, () => {
        const page_requester = new ITestPageRequester(PrefixedUrls.HOME_WITH_COMPANY_NUMBER.replace(":companyNumber", TEST_COMPANY_NUMBER), () => { });
        assert_page_loads(page_requester);
        assert_next_page_linked_is(page_requester, PrefixedUrls.BEFORE_YOU_FILE_PACKAGE_ACCOUNTS_WITH_COMPANY_NUMBER.replace(":companyNumber", TEST_COMPANY_NUMBER));
    });
    describe(PrefixedUrls.BEFORE_YOU_FILE_PACKAGE_ACCOUNTS_WITH_COMPANY_NUMBER, () => {
        const page_requester = new ITestPageRequester(PrefixedUrls.BEFORE_YOU_FILE_PACKAGE_ACCOUNTS_WITH_COMPANY_NUMBER.replace(":companyNumber", TEST_COMPANY_NUMBER), () => {
            disable_csrf_middleware();
            disable_auth_middleware();
            set_session_middleware_data(session);
            mockGetCompanyProfileResult(getTemplateCompanyProfile());
        });
        beforeEach(() => {
            session_itest_overwrite_session_login(session);
        });
        assert_page_loads(page_requester);
        assert_has_button_that_sends_post_request(page_requester);
        assert_on_post_request_redirects_to(page_requester, PrefixedUrls.CHOOSE_YOUR_ACCOUNTS_PACKAGE as RegexString);

        assert_after_post_session_contains_extra_data(page_requester, session, ContextKeys.COMPANY_NUMBER, TEST_COMPANY_NUMBER);
        assert_after_post_session_contains_extra_data(page_requester, session, ContextKeys.COMPANY_NAME, TEST_COMPANY_NAME);
        assert_after_post_session_contains_extra_data(page_requester, session, ContextKeys.IS_CHS_JOURNEY, true);
    });
});
