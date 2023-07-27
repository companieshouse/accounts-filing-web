jest.mock("../../src/utils/logger");

import mocks from "../mocks/all.middleware.mock";
import request from "supertest";
import app from "../../src/app";
import { logger } from "../../src/utils/logger";

const mockLoggerErrorRequest = logger.errorRequest as jest.Mock;

const EXPECTED_TEXT = "Page not found";
const INCORRECT_URL = "/accounts-filing-web/company-numberr";

describe("Error controller test", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Should return page not found screen if page url is not recognised", async () => {
    const response = await request(app)
      .get(INCORRECT_URL);
    expect(response.text).toContain(EXPECTED_TEXT);
    expect(response.status).toEqual(404);
    expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
  });
});