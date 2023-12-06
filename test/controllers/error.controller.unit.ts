jest.mock("../../src/utils/logger");

import { mockAuthenticationMiddleware } from "../mocks/all.middleware.mock";
import request from "supertest";
import app from "../../src/app";
import { servicePathPrefix } from "../../src/utils/constants/urls";

const EXPECTED_TEXT = "Page not found";
const INCORRECT_URL = servicePathPrefix + "/company-number";

describe("Error controller test", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("Should return page not found screen if page url is not recognised", async () => {
        const response = await request(app)
            .get(INCORRECT_URL);

        expect(response.status).toEqual(404);
        expect(response.text).toContain(EXPECTED_TEXT);
        expect(mockAuthenticationMiddleware).toHaveBeenCalled();
    });
});
