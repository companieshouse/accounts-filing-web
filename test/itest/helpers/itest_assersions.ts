import { ITestPageRequester } from "./request_helper";
import { RegexString } from "../test_types";
import { JSDOM } from 'jsdom';
import { Session } from "@companieshouse/node-session-handler";
import util from "node:util";

export function assert_page_loads(requester: ITestPageRequester) {
    it("Page Loads", async () => {
        const response = await requester.get();
        expect(response.status).toBe(200);
    });
}

export function assert_page_redirects(requester: ITestPageRequester, expected_redirect_url: RegexString) {
    it(`Page Redirects to '${expected_redirect_url}'`, async () => {
        const response = await requester.get();
        expect(response.status).toBe(302);
        expect(response.headers.location).toMatch(new RegExp(expected_redirect_url));
    });
}

export function assert_next_page_linked_is(requester: ITestPageRequester, expected_next_url: string) {
    it(`Next linked page is '${expected_next_url}'`, async () => {
        const response = await requester.get();
        expect(response.text).toMatch(new RegExp(`.*href=[^>]+${expected_next_url}.*`));
    });
}

function build_back_button_search_regex(expected_back_url: string): RegExp {
    const href_regex = `href=[^>]+${expected_back_url}`;
    const back_button_class_regex = `class=[^>]+govuk-back-link`;
    return new RegExp(`.*<a[^>]*(${href_regex}[^>]*${back_button_class_regex}|${back_button_class_regex}[^>]*${href_regex}).*`);
}

export function assert_back_button_link_is(requester: ITestPageRequester, expected_back_url: string) {
    it(`Back Button links to page '${expected_back_url}'`, async () => {
        const response = await requester.get();
        expect(response.text).toMatch(build_back_button_search_regex(expected_back_url));
    });
}

export function assert_has_button_that_sends_post_request(requester: ITestPageRequester) {
    it(`Page has button which will send POST request`, async () => {
        const response = await requester.get();
        expect(
            new JSDOM(response.text).window.document.querySelector(
                'form[method="post"] button'
            )
        ).not.toBeNull();
    });
}

export function assert_on_post_request_redirects_to(requester: ITestPageRequester, expected_redirect_url: RegexString, form_data: object = {}) {
    it(`On POST request will redirect to '${expected_redirect_url}'`, async () => {
        const response = await requester.post_form(form_data);
        expect(response.status).toBe(302);
        expect(response.headers.location).toMatch(new RegExp(expected_redirect_url));
    });
}

export function assert_after_get_session_contains_extra_data(requester: ITestPageRequester, session: Session, extraDataKey: string, expectedValue: any, ensureWasUndefined: boolean = true) {
    it(`After GET, session-key '${extraDataKey}' is ${util.inspect(expectedValue, { depth: null, compact: true, breakLength: Infinity, maxArrayLength: null, maxStringLength: null })}`, async () => {
        if (ensureWasUndefined && session.getExtraData(extraDataKey) !== undefined) { throw new Error(`The key '${extraDataKey}' was set before request!?`); }
        await requester.get();
        if (typeof expectedValue === "object") {
            expect(session.getExtraData(extraDataKey)).toEqual(expect.objectContaining(expectedValue));
        } else {
            expect(session.getExtraData(extraDataKey)).toBe(expectedValue);
        }
    });
}

export function assert_after_post_session_contains_extra_data(requester: ITestPageRequester, session: Session, extraDataKey: string, expectedValue: any, form_data: object = {}, ensureWasUndefined: boolean = true) {
    it(`After POST, session-key '${extraDataKey}' is ${util.inspect(expectedValue, { depth: null, compact: true, breakLength: Infinity, maxArrayLength: null, maxStringLength: null })}`, async () => {
        if (ensureWasUndefined && session.getExtraData(extraDataKey) !== undefined) { throw new Error(`The key '${extraDataKey}' was set before request!?`); }
        await requester.post_form(form_data);
        expect(session.getExtraData(extraDataKey)).toBe(expectedValue);
    });
}
