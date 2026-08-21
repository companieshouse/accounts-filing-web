jest.mock("@companieshouse/web-security-node", () => ({
    authMiddleware: jest.fn()
}));

import { Request, Response } from "express";
import { authMiddleware } from "@companieshouse/web-security-node";
import { companyAuthenticationMiddleware } from "../../src/middleware/company.authentication.middleware";
import { getSessionRequest } from "../mocks/session.mock";
import { ContextKeys } from "../../src/utils/constants/context.keys";
import { setEnvVars } from "../test_utils";

describe("companyAuthenticationMiddleware", () => {
    const mockNext = jest.fn();
    const mockRedirect = jest.fn();
    const mockAuthHandler = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (authMiddleware as jest.Mock).mockReturnValue(mockAuthHandler);
    });

    it("should redirect BR company numbers to stop page when feature flag is on", () => {
        const cleanup = setEnvVars({ FEATURE_FLAG_BR_COMPANY_STOP_SCREEN: true });
        const session = getSessionRequest();
        session.setExtraData(ContextKeys.COMPANY_NUMBER, "BR000804");

        companyAuthenticationMiddleware({
            session,
            query: {}
        } as unknown as Request, {
            redirect: mockRedirect
        } as unknown as Response, mockNext);

        expect(mockRedirect).toHaveBeenCalledWith("/accounts-filing/cannot-file-full-accounts-for-company-type?lang=en");
        expect(authMiddleware).not.toHaveBeenCalled();
        cleanup();
    });

    it("should call auth middleware for BR company numbers when feature flag is off", () => {
        const cleanup = setEnvVars({ FEATURE_FLAG_BR_COMPANY_STOP_SCREEN: false });
        const session = getSessionRequest();
        session.setExtraData(ContextKeys.COMPANY_NUMBER, "BR000804");

        companyAuthenticationMiddleware({
            session,
            query: {},
            originalUrl: "/accounts-filing/choose-your-accounts-package"
        } as unknown as Request, {
            redirect: mockRedirect
        } as unknown as Response, mockNext);

        expect(authMiddleware).toHaveBeenCalledTimes(1);
        expect(mockAuthHandler).toHaveBeenCalledTimes(1);
        cleanup();
    });
});
