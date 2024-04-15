export const mockApiClient = {
    transaction: {
        putTransaction: jest.fn(),
        postTransaction: jest.fn()
    }
};
export const mockCreatePublicOAuthApiClient = jest.fn();
export const mockMakeApiCall = jest.fn();

jest.mock("../../src/services/internal/api.client.service", () => {
    return {
        createPublicOAuthApiClient: mockCreatePublicOAuthApiClient.mockReturnValue(mockApiClient),
        makeApiCall: async (session: any, fn: any) => {
            return await fn(mockApiClient);
        },
        makeApiKeyCall: async (fn: any) => {
            return await fn(mockApiClient);
        },
    };
});
