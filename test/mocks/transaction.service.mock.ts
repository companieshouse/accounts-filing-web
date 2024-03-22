export const mockTranactionService = {
    closeTransaction: jest.fn(),
    postTransactionRecord: jest.fn()
};

jest.mock("../../src/services/external/transaction.service", () => {
    return {
        TransactionService: jest.fn().mockReturnValue(mockTranactionService),
    };
});
