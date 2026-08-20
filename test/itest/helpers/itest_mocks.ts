import { NextFunction, Request, Response } from "express";
import * as sessionMiddleware from "../../../src/middleware/session.middleware";
import { Session } from "@companieshouse/node-session-handler";
import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile";
import { Transaction } from "@companieshouse/api-sdk-node/dist/services/transaction/types";
import { AccountsFilingCompanyResponse } from "@companieshouse/api-sdk-node/dist/services/accounts-filing/types";

export function synchronously_import_module(module_path: string) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require(module_path);
}

export function disable_csrf_middleware() {
    jest.doMock("@companieshouse/web-security-node", () => ({ CsrfProtectionMiddleware: () => (_req: Request, _res: Response, next: NextFunction) => next() }));
}

export function disable_auth_middleware() {
    jest.doMock("../../../src/middleware/authentication.middleware", () => ({ authenticationMiddleware: (_req: Request, _res: Response, next: NextFunction) => next() }));
}

export function disable_company_auth_middleware() {
    jest.doMock("../../../src/middleware/company.authentication.middleware", () => ({ companyAuthenticationMiddleware: (_req: Request, _res: Response, next: NextFunction) => next() }));
}

export function set_session_middleware_data(session: Session) {
    jest.spyOn(sessionMiddleware, "sessionMiddleware").mockImplementation((_opts) => (req: Request, res: Response, next: NextFunction) => {
        req.session = session;
        next();
    });
}

export function mockGetCompanyProfileResult(companyProfile: CompanyProfile) {
    const CompanyProfileServiceModule = synchronously_import_module("../../../src/services/external/company.profile.service");
    jest.spyOn(CompanyProfileServiceModule.CompanyProfileService.prototype, 'getCompanyProfile').mockResolvedValue(companyProfile);
}

export function mockPostTransactionRecord(transaction: Transaction) {
    const TransactionServiceModule = synchronously_import_module("../../../src/services/external/transaction.service");
    jest.spyOn(TransactionServiceModule.TransactionService.prototype, 'postTransactionRecord').mockResolvedValue(transaction);
}

export function mockPutTransaction(transaction: Transaction) {
    const TransactionServiceModule = synchronously_import_module("../../../src/services/external/transaction.service");
    jest.spyOn(TransactionServiceModule.TransactionService.prototype, 'putTransaction').mockResolvedValue({ httpStatusCode: 200, resource: transaction });
}

export function mockAccountsFilingService(mock_account_filing_id: string) {
    const AccountsFilingServiceModule = synchronously_import_module("../../../src/services/external/accounts.filing.service");
    jest.spyOn(AccountsFilingServiceModule.AccountsFilingService.prototype, 'checkCompany').mockResolvedValue({ httpStatusCode: 200, resource: { accountsFilingId: mock_account_filing_id } as AccountsFilingCompanyResponse });
    jest.spyOn(AccountsFilingServiceModule.AccountsFilingService.prototype, 'setTransactionPackageType').mockImplementation(async (_session) => {});
}
