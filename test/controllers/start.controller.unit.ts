import { mockAuthenticationMiddleware } from "../mocks/all.middleware.mock";
import request from "supertest";
import app from "../../src/app";
import { servicePathPrefix } from "../../src/utils/constants/urls";

describe("start controller tests", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return start page", async () => {
        await request(app)
            .get("/accounts-filing");

        expect(mockAuthenticationMiddleware).not.toHaveBeenCalled();
    });

    it("should return start page when url has trailing slash", async () => {
        await request(app)
            .get("/accounts-filing/");

        expect(mockAuthenticationMiddleware).not.toHaveBeenCalled();
    });

    it("should return start page with home ref to home link", async () => {
        const req = await request(app)
            .get(servicePathPrefix);

        expect(req.text).toContain(`<a href="/accounts-filing" class="govuk-header__link govuk-header__link--service-name">File package accounts with Companies House</a>`);
    });

    it("should translate `Support link` to Welsh for home page", async () => {

        const req = await request(app)
            .get(servicePathPrefix + "?lang=cy");

        expect(req.text).toContain("Dolenni cymorth");
    });

    it("should translate `Support link` to Welsh for home page", async () => {

        const req = await request(app)
            .get(servicePathPrefix + "?lang=cy");

        expect(req.text).toContain("Dolenni cymorth");
    });

});
