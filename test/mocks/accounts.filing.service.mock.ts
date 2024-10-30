export const mockAccountsFilingService = {
    getValidationStatus: jest.fn(),
    checkCompany: jest.fn(),
    setTransactionPackageType: jest.fn(),
    session: {
        getSessionData: jest.fn(),
        setSessionData: jest.fn()
    }
};

jest.mock("../../src/services/external/accounts.filing.service", () => {
    return {
        AccountsFilingService: jest.fn().mockImplementation(() => mockAccountsFilingService)
    };
});
