import { ITestPageRequester } from "./request_helper";
import { RegexString } from "../test_types";
import { JSDOM } from 'jsdom';


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
