import { Request } from "express";
import { CompanyAuthenticationHelper } from '../../../../src/utils/middleware/helper/company.authentication.helper';

describe("CompanyAuthenticationHelper", () => {

    const PARAM_COMPANY_NUMBER = "abcdefgh";
    it("companyNumber is present", () => {
        const req = {} as unknown as Request;
        req.params = { companyNumber: PARAM_COMPANY_NUMBER };

        expect(
            CompanyAuthenticationHelper.getCompanyNumberFromRequest(req)
        ).toEqual(PARAM_COMPANY_NUMBER);
    });
});
