import { logger } from "../../../utils/logger";
import { GenericHandler } from "../generic";
import {
    servicePathPrefix,
} from "../../../utils/constants/urls";
import { Request, Response } from "express";
import { ContextKeys } from "../../../utils/constants/context.keys";
import { TransactionService } from "../../../services/external/transaction.service";
import { AccountsFilingService } from "services/external/accounts.filing.service";
import { getCompanyNumber, must } from "../../../utils/session";
import { TRANSACTION_DESCRIPTION, TRANSACTION_REFERENCE } from "../../../utils/constants/transaction";
import { constructValidatorRedirect } from "../../../utils/url";

export class UploadHandler extends GenericHandler {
    constructor(private accountsFilingService: AccountsFilingService, private transactionService: TransactionService) {
        super({
            title: '',
            backURL: `${servicePathPrefix}`
        });
    }

    async execute(req: Request, _res: Response): Promise<string> {
        logger.info(`GET Request to send fileId call back address`);

        const companyNumber = must(getCompanyNumber(req.session));

        const transactionId = await this.callTransactionApi(companyNumber);
        req.session?.setExtraData(ContextKeys.TRANSACTION_ID, transactionId);

        if (transactionId === undefined) {
            throw new Error("transaction Id in undefined");
        }

        try {
            const result = await this.accountsFilingService.checkCompany(
                companyNumber,
                transactionId
            );
            if (result.httpStatusCode !== 200) {
                logger.error(`check company failed. ${JSON.stringify(result, null, 2)}`);
                throw result;
            }

            req.session?.setExtraData(
                ContextKeys.ACCOUNTS_FILING_ID,
                result.resource?.accountsFilingId
            );
        } catch (error) {
            logger.error(`Exception returned from SDK while confirming company for company number - [${companyNumber}]. Error: ${JSON.stringify(error, null, 2)}`);
            throw error;
        }

        return constructValidatorRedirect(req);
    }

    async callTransactionApi(companyNumber: string): Promise<string | undefined> {
        try {
            const transaction = await this.transactionService.postTransactionRecord(companyNumber, TRANSACTION_REFERENCE, TRANSACTION_DESCRIPTION);
            return transaction.id;
        } catch (error) {
            logger.error(`Exception return from SDK while requesting creation of a transaction for company number [${companyNumber}].`);
            return undefined;
        }
    }


}

