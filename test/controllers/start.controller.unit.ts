import middlewareMocks from "../mocks/all.middleware.mock";
import request from "supertest";
import app from "../../src/app";

describe("start controller tests", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return start page", async () => {
        await request(app)
            .get("/accounts-filing");

        expect(middlewareMocks.mockAuthenticationMiddleware).not.toHaveBeenCalled();
    });

    it("should return start page when url has trailing slash", async () => {
        await request(app)
            .get("/accounts-filing/");

        expect(middlewareMocks.mockAuthenticationMiddleware).not.toHaveBeenCalled();
    });

});
