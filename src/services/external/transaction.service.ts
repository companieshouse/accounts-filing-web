import { Resource } from "@companieshouse/api-sdk-node";
import ApiClient from "@companieshouse/api-sdk-node/dist/client";
import { logger } from "../../utils/logger";
import { Transaction } from "@companieshouse/api-sdk-node/dist/services/transaction/types";


export class TransactionService {
    constructor(private apiClient: ApiClient) {}

    async postTransactionRecord(companyNumber: string, reference: string, description: string): Promise<Transaction> {
        const transactionRecord = this.createTransactionRecord(companyNumber, reference, description);

        logger.debug(`Created Transaction Record using Company Number: ${companyNumber}, Reference: ${reference}, Description: ${description}`);

        const transactionService = this.apiClient.transaction;
        const transactionServiceResponse = await transactionService.postTransaction(transactionRecord);

        if (transactionServiceResponse.httpStatusCode !== 201) {
            logger.error(`Non 201 response from transaction service. ${companyNumber}`);
            throw transactionServiceResponse;
        }

        if (!isResource(transactionServiceResponse)) {
            logger.error(`Transaction service response did not include a resource. Response: ${companyNumber}`);
            throw new Error("Transaction service didn't return a resource");
        }

        if(transactionServiceResponse.resource == undefined){
            throw new Error("no resource returned")
        }
        
        return transactionServiceResponse.resource
    }
    
    createTransactionRecord(companyNumber: string, reference: string, description: string): Transaction {
        const transaction: Transaction = {
            companyName: companyNumber,
            description: description,
            reference: reference
        }
        return transaction;
    } 
    
}

function isResource(o: any): o is Resource<unknown> {
    return o !== null && o !== undefined && 'resource' in o;
}