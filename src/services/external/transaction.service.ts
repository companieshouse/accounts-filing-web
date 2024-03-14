import { Resource } from "@companieshouse/api-sdk-node";
import { createAndLogError, logger } from "../../utils/logger";
import { Transaction } from "@companieshouse/api-sdk-node/dist/services/transaction/types";
import { ApiErrorResponse, ApiResponse } from "@companieshouse/api-sdk-node/dist/services/resource";
import { Session } from "@companieshouse/node-session-handler";
import { getAccountsFilingId, getCompanyNumber, getTransactionId, must } from "../../utils/session";
import { headers } from "../../utils/constants/headers";
import { TRANSACTION_DESCRIPTION, TRANSACTION_REFERENCE, TransactionStatuses } from "../../utils/constants/transaction";
import { makeApiCall } from "../../services/internal/api.client.service";


export class TransactionService {
    constructor(private session: Session) {}

    /**
     * Closes an open transaction and potentially returns a payment URL.
     *
     * This method retrieves essential identifiers such as the company number, accounts filing ID,
     * and transaction ID from the session, and then makes an API call to update the transaction
     * status to CLOSED. If the transaction closure triggers a payment requirement, it extracts
     * and returns the payment URL from the response headers. Otherwise, it returns undefined.
     *
     * @returns {Promise<string | undefined>} A promise that resolves to the payment URL if the
     * closed transaction requires a payment, or undefined if no payment is required.
     * @throws {Error} If any of the required identifiers cannot be retrieved from the session,
     * an error will be thrown, indicating a missing or invalid identifier.
     */
    public async closeTransaction(): Promise<string | undefined> {
        const companyNumber = must(getCompanyNumber(this.session));
        const accountsFilingId = must(getAccountsFilingId(this.session));
        const transactionId = must(getTransactionId(this.session));

        const apiResponse = await this.putTransaction(companyNumber, accountsFilingId, transactionId, TransactionStatuses.CLOSED);

        // Get payment url from response headers
        return this.getPaymentUrl(apiResponse);
    }

    private getPaymentUrl(apiResponse: ApiResponse<unknown>): string | undefined {
        return apiResponse.headers?.[headers.PAYMENT_REQUIRED];
    }

    /**
     * Updates a given transaction associated with a company number and specific accounts filing ID.
     *
     * This function constructs the transaction reference, sets the transaction details, and then
     * tries to update the transaction using the API client. If the update is unsuccessful or no
     * response is received, it throws an error. Successful API responses are logged and returned.
     *
     * @param {string} companyNumber - The unique identifier for the company.
     * @param {string} accountsFilingId - The identifier for the specific account filing.
     * @param {string} transactionId - The unique identifier for the transaction to update.
     * @param {string} transactionStatus - The new status to be set for the transaction.
     * @returns {Promise<ApiResponse<Transaction>>} - A promise that resolves with the API response containing the transaction data.
     * @throws {Error} - Throws an error if the API request does not return a response or if the HTTP status code is 400 or above.
     */
    public async putTransaction(
        companyNumber: string,
        accountsFilingId: string,
        transactionId: string,
        transactionStatus: string
    ): Promise<ApiResponse<Transaction>> {
        const accountsFilingTransactionReference = `${TRANSACTION_REFERENCE}_${accountsFilingId}`;
        const transaction: Transaction = {
            companyNumber,
            description: TRANSACTION_DESCRIPTION,
            id: transactionId,
            reference: accountsFilingTransactionReference,
            status: transactionStatus
        };

        logger.debug(`Updating transaction id ${transactionId} with company number ${companyNumber}, status ${transactionStatus}`);
        const sdkResponse = await makeApiCall(this.session, async apiClient => {
            return await apiClient.transaction.putTransaction(transaction);
        });

        if (!sdkResponse) {
            throw createAndLogError(`Transaction API PUT request returned no response for transaction id ${transactionId}, company number ${companyNumber}`);
        }

        if (!sdkResponse.httpStatusCode || sdkResponse.httpStatusCode >= 400) {
            throw createAndLogError(`Http status code ${sdkResponse.httpStatusCode} - Failed to put transaction for transaction id ${transactionId}, company number ${companyNumber}`);
        }

        const castedSdkResponse = sdkResponse as ApiResponse<Transaction>;

        logger.debug(`Received transaction ${JSON.stringify(sdkResponse)}`);

        return castedSdkResponse;
    }


    async postTransactionRecord(companyNumber: string, reference: string, description: string): Promise<Transaction> {
        const transactionRecord = this.createTransactionRecord(companyNumber, reference, description);

        logger.debug(`Created Transaction Record using Company Number: ${companyNumber}, Reference: ${reference}, Description: ${description}`);

        const transactionServiceResponse = await makeApiCall(this.session, async apiClient => {
            return await apiClient.transaction.postTransaction(transactionRecord);
        });

        if (transactionServiceResponse.httpStatusCode !== 201) {
            logger.error(`Non 201 response from transaction service. ${companyNumber}`);
            throw transactionServiceResponse;
        }

        return getTransaction(transactionServiceResponse);
    }

    createTransactionRecord(companyNumber: string, reference: string, description: string): Transaction {
        const transaction: Transaction = {
            companyName: companyNumber,
            description: description,
            reference: reference

        };
        return transaction;
    }
}

function getTransaction(transactionResource: Resource<Transaction> | ApiErrorResponse): Transaction {
    if (!isResource(transactionResource)) {
        logger.error(`Transaction service response did not include a resource.`);
        throw new Error("Transaction service didn't return a resource");
    }


    if (transactionResource.resource === undefined || transactionResource.resource === null){
        throw new Error("Transaction service return resource contains a undefined or null");
    }

    return transactionResource.resource;
}

function isResource(o: any): o is Resource<unknown> {
    return o !== null && o !== undefined && 'resource' in o;
}

