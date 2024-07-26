import { mockAuthenticationMiddleware } from "../mocks/all.middleware.mock";
import request from "supertest";
import app from "../../src/app";
import { Urls, servicePathPrefix } from "../../src/utils/constants/urls";

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

    it("should translate `Support link` to Welsh on every page", async () => {

        const urlList = Object.entries(Urls);
        urlList.forEach(
            async url => {
                let req: {
                    text: string
                };
                if (url[0] === "HOME"){
                    req = await request(app)
                        .get(servicePathPrefix + "?lang=cy");
                } else {
                    req = await request(app)
                        .get(url[1] + "?lang=cy");
                }

                expect(req.text).toContain(`<a href="/accounts-filing" class="govuk-header__link govuk-header__link--service-name">File package accounts with Companies House</a>`);
            }
        );
    });

});
