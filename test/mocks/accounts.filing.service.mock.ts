export const mockAccountsFilingService = {
    getValidationStatus: jest.fn(),
    checkCompany: jest.fn(),
    setTransactionPackageType: jest.fn()
};

jest.mock("../../src/services/external/accounts.filing.service", () => {
    return {
        AccountsFilingService: jest.fn().mockImplementation(() => mockAccountsFilingService)
    };
});
