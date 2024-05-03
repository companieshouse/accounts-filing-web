jest.mock("../../../src/utils/logger");
jest.mock("../../../src/services/internal/api.client.service");
jest.mock("uuid");

import { Session } from "@companieshouse/node-session-handler";
import { createAndLogError } from "../../../src/utils/logger";
import { createPaymentApiClient } from "../../../src/services/internal/api.client.service";
import { startPaymentsSession } from "../../../src/services/external/payment.service";
import { ApiResponse, ApiResult } from "@companieshouse/api-sdk-node/dist/services/resource";
import { CreatePaymentRequest, Payment } from "@companieshouse/api-sdk-node/dist/services/payment";
import { v4 as uuidv4 } from "uuid";
import { mockPayment } from "../../mocks/payment.mock";
import { getPaymentResourceUri, PAYMENT_REDIRECT_URI } from "../../../src/utils/url";


const PAYMENT_SESSION_URL = "/payment/21321";
const ACCOUNTS_FILING_ID = "478478478";
const TRANSACTION_ID = "987456";
const UUID = "d29f8b9c-501d-4ae3-91b2-001fd9e4e0a6";
const REFERENCE = "Package_Account_" + ACCOUNTS_FILING_ID;

const mockCreatePaymentWithFullUrl = jest.fn();
const mockCreatePaymentApiClient = createPaymentApiClient as jest.Mock;
mockCreatePaymentApiClient.mockReturnValue({
    payment: {
        createPaymentWithFullUrl: mockCreatePaymentWithFullUrl
    }
});

const mockIsFailure = jest.fn();
mockIsFailure.mockReturnValue(false);

const mockIsSuccess = jest.fn();
mockIsSuccess.mockReturnValue(true);

const mockUuidv4 = uuidv4 as jest.Mock;
mockUuidv4.mockReturnValue(UUID);

const mockCreateAndLogError = createAndLogError as jest.Mock;
const ERROR: Error = new Error("oops");
mockCreateAndLogError.mockReturnValue(ERROR);

const mockHeaders = {
    header1: "45435435"
};

const mockErrors = {
    error1: "something"
};

const mockApiResponse = {
    errors: mockErrors,
    headers: mockHeaders,
    httpStatusCode: 200,
    resource: mockPayment
} as ApiResponse<Payment>;

const mockPaymentResult = {
    isFailure: mockIsFailure,
    value: mockApiResponse,
    isSuccess: mockIsSuccess
} as ApiResult<ApiResponse<Payment>>;

let session: any;

describe("Payment Service tests", () => {

    beforeEach(() => {
        jest.clearAllMocks();
        session = new Session;
    });

    describe("startPaymentsSession tests", () => {

        it("Should return a successful response", async () => {
            mockApiResponse.httpStatusCode = 200;
            mockCreatePaymentWithFullUrl.mockResolvedValueOnce(mockPaymentResult);
            const apiResponse: ApiResponse<Payment> = await startPaymentsSession(session, PAYMENT_SESSION_URL, ACCOUNTS_FILING_ID, TRANSACTION_ID);

            expect(apiResponse.httpStatusCode).toBe(200);
            expect(apiResponse.resource).toBe(mockPayment);
            expect(apiResponse.headers).toBe(mockHeaders);

            expect(mockCreatePaymentApiClient).toBeCalledWith(session, PAYMENT_SESSION_URL);

            const paymentRequest: CreatePaymentRequest = mockCreatePaymentWithFullUrl.mock.calls[0][0];
            expect(paymentRequest.redirectUri).toBe(PAYMENT_REDIRECT_URI);
            expect(paymentRequest.reference).toBe(REFERENCE);
            expect(paymentRequest.resource).toBe(getPaymentResourceUri(TRANSACTION_ID));
            expect(paymentRequest.state).toBe(UUID);
        });

        it("Should throw error on payment failure 401 response", async () => {
            mockApiResponse.httpStatusCode = 401;
            mockIsFailure.mockReturnValueOnce(true);
            mockCreatePaymentWithFullUrl.mockResolvedValueOnce(mockPaymentResult);

            await expect(startPaymentsSession(session, PAYMENT_SESSION_URL, ACCOUNTS_FILING_ID, TRANSACTION_ID))
                .rejects
                .toThrow(ERROR);

            expect(mockCreateAndLogError).toBeCalledWith("payment.service Http status code 401 - Failed to create payment,  {\"error1\":\"something\"}");
        });

        it("Should throw error on payment failure 429 response", async () => {
            mockApiResponse.httpStatusCode = 429;
            mockIsFailure.mockReturnValueOnce(true);
            mockCreatePaymentWithFullUrl.mockResolvedValueOnce(mockPaymentResult);

            await expect(startPaymentsSession(session, PAYMENT_SESSION_URL, ACCOUNTS_FILING_ID, TRANSACTION_ID))
                .rejects
                .toThrow(ERROR);

            expect(mockCreateAndLogError).toBeCalledWith("payment.service Http status code 429 - Failed to create payment,  {\"error1\":\"something\"}");
        });

        it("Should throw error on payment failure with unknown http response", async () => {
            mockApiResponse.httpStatusCode = 500;
            mockIsFailure.mockReturnValueOnce(true);
            mockCreatePaymentWithFullUrl.mockResolvedValueOnce(mockPaymentResult);

            await expect(startPaymentsSession(session, PAYMENT_SESSION_URL, ACCOUNTS_FILING_ID, TRANSACTION_ID))
                .rejects
                .toThrow(ERROR);

            expect(mockCreateAndLogError).toBeCalledWith('payment.service Unknown Error {"error1":"something"}');
        });
    });
});
