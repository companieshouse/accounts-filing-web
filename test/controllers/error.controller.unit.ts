jest.mock("../../src/utils/logger");

import mockCsrfProtectionMiddleware from "../mocks/csrf.protection.middleware.mock";
import { mockAuthenticationMiddleware } from "../mocks/all.middleware.mock";
import { servicePathPrefix } from "../../src/utils/constants/urls";
import { getRequestWithCookie } from "../routers/helper/requests";

const EXPECTED_TEXT = "Page not found";
const INCORRECT_URL = servicePathPrefix + "/company-number";

describe("Error controller test", () => {
    beforeEach(() => {
        mockCsrfProtectionMiddleware.mockClear();
        jest.clearAllMocks();
    });

    it("Should return page not found screen if page url is not recognised", async () => {
        const response = await getRequestWithCookie(INCORRECT_URL);

        expect(response.status).toEqual(404);
        expect(response.text).toContain(EXPECTED_TEXT);
        expect(mockAuthenticationMiddleware).toHaveBeenCalled();
    });
});
