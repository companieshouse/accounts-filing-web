import { Session } from "@companieshouse/node-session-handler";
import ApiClient from "@companieshouse/api-sdk-node/dist/client";
import { createPaymentApiClient } from "../internal/api.client.service";
import { CreatePaymentRequest, Payment } from "@companieshouse/api-sdk-node/dist/services/payment";
import { v4 as uuidv4 } from "uuid";
import { createAndLogError, logger } from "../../utils/logger";
import { ApiResponse } from "@companieshouse/api-sdk-node/dist/services/resource";
import { getPaymentResourceUri, PAYMENT_REDIRECT_URI } from "../../utils/url";

export const startPaymentsSession = async (session: Session, paymentSessionUrl: string, accountsFilingId: string, transactionId: string): Promise<ApiResponse<Payment>> => {
    const apiClient: ApiClient = createPaymentApiClient(session, paymentSessionUrl);
    const resourceWithHost = getPaymentResourceUri(transactionId);
    const reference: string = `Package_Account_${accountsFilingId}`;
    const state = uuidv4();

    session.setExtraData("payment-nonce", state);

    const createPaymentRequest: CreatePaymentRequest = {
        redirectUri: PAYMENT_REDIRECT_URI,
        reference: reference,
        resource: resourceWithHost,
        state: state,
    };
    logger.debug(`Redirect URI - ${createPaymentRequest.redirectUri} , Resource - ${createPaymentRequest.resource}`);

    const paymentResult = await apiClient.payment.createPaymentWithFullUrl(createPaymentRequest);

    if (paymentResult.isFailure()) {
        const errorResponse = paymentResult.value;
        logger.error(`payment.service failure to create payment session - http response status code = ${errorResponse?.httpStatusCode} - ${JSON.stringify(errorResponse?.errors)}`);
        if (errorResponse.httpStatusCode === 401 || errorResponse.httpStatusCode === 429) {
            return Promise.reject(createAndLogError(`payment.service Http status code ${errorResponse.httpStatusCode} - Failed to create payment,  ${JSON.stringify(errorResponse?.errors) || "Unknown Error"}`));
        } else {
            return Promise.reject(createAndLogError(`payment.service Unknown Error ${JSON.stringify(errorResponse?.errors) || "No Errors found in response"}`));
        }
    } else {
        logger.info(`Payment session has been created`);
        return paymentResult.value;
    }
};
