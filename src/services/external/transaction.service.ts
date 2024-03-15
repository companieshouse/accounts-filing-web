import { Resource } from "@companieshouse/api-sdk-node";
import ApiClient from "@companieshouse/api-sdk-node/dist/client";
import { logger } from "../../utils/logger";
import { Transaction } from "@companieshouse/api-sdk-node/dist/services/transaction/types";
import { ApiErrorResponse } from "@companieshouse/api-sdk-node/dist/services/resource";


export class TransactionService {
    constructor(private apiClient: ApiClient) {}

    async postTransactionRecord(companyNumber: string, reference: string, description: string): Promise<Transaction> {
        const transactionRecord = this.createTransactionRecord(companyNumber, reference, description);

        logger.debug(`Created Transaction Record using Company Number: ${companyNumber}, Reference: ${reference}, Description: ${description}`);

        const transactionServiceResponse = await this.apiClient.transaction.postTransaction(transactionRecord);

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
