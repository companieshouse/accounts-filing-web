import { Request } from "express";
import { getSessionRequest } from '../../../mocks/session.mock';
import { CompanyAuthenticationHelper } from '../../../../src/utils/middleware/helper/company.authentication.helper';

describe("CompanyAuthenticationHelper", () => {

    const PARAM_COMPANY_NUMBER = "abcdefgh";
    const SESSION_COMPANY_NUMBER = "12345678";
    it("if both param and session are present pick param value", () => {
        const req = {} as unknown as Request;
        req.session = getSessionRequest();
        req.session.data.signin_info!.company_number = SESSION_COMPANY_NUMBER;
        req.params = { companyNumber: PARAM_COMPANY_NUMBER };

        expect(
            CompanyAuthenticationHelper.getCompanyNumberFromRequest(req)
        ).toEqual(PARAM_COMPANY_NUMBER);
    });

    it("if params is not set, return session's company number", () => {
        const req = {} as unknown as Request;
        req.session = getSessionRequest();
        req.session.data.signin_info!.company_number = SESSION_COMPANY_NUMBER;

        expect(
            CompanyAuthenticationHelper.getCompanyNumberFromRequest(req)
        ).toEqual(SESSION_COMPANY_NUMBER);
    });
});
