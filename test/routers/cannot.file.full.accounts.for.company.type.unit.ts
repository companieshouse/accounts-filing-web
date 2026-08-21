import mockCsrfProtectionMiddleware from "../mocks/csrf.protection.middleware.mock";
import { PrefixedUrls } from "../../src/utils/constants/urls";
import { getRequestWithCookie } from "./helper/requests";

describe("cannot file full accounts for company type page", () => {
    beforeEach(() => {
        mockCsrfProtectionMiddleware.mockClear();
    });

    it("should render stop page with required content and guidance link", async () => {
        const response = await getRequestWithCookie(PrefixedUrls.CANNOT_FILE_FULL_ACCOUNTS_FOR_COMPANY_TYPE);

        expect(response.statusCode).toBe(200);
        expect(response.text).toContain("You cannot file full accounts for this company type");
        expect(response.text).toContain("You cannot file accounts for a UK Establishment of an overseas company. Only the overseas company can file accounts.");
        expect(response.text).toContain("https://www.gov.uk/guidance/file-accounts-in-the-uk-as-an-overseas-company");
        expect(response.text).toContain(PrefixedUrls.COMPANY_SEARCH);
    });
});
