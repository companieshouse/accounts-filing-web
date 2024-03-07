import { logger } from "../../../utils/logger";
import { GenericHandler } from "../generic";
import { env } from "../../../config";
import { fileIdPlaceholder, servicePathPrefix, uploadedUrl } from "../../../utils/constants/urls";
import { Request, Response } from "express";
import { ContextKeys } from "../../../utils/constants/context.keys";
import { TransactionService } from "../../../services/external/transaction.service";

export class UploadHandler extends GenericHandler {
    constructor (private transactionService: TransactionService) {
        super({
            title: '',
            backURL: `${servicePathPrefix}`
        });
    }

    async execute (req: Request, _res: Response): Promise<string> {
        logger.info(`GET Request to send fileId call back address`);
        const transactionId = await this.callTransactionApi(req, _res);
        req.session?.setExtraData(ContextKeys.TRANSACTION_ID, transactionId);
        return getFileUploadUrl(req);
    }

    async callTransactionApi(req: Request, _res: Response): Promise<string | undefined> {
        const companyName = req.session?.data.signin_info?.company_number;
        const reference = env.APP_NAME;
        const description = "Accounts Filing Web";

        if(companyName == undefined) {
            logger.error("session has no company number")
            throw new Error("no company number")
        }
        if(reference == undefined) {
            logger.error("environment has no app name to be used as a reference")
            throw new Error("no reference")
        }

        try{
            const transaction = await this.transactionService.postTransactionRecord(companyName, reference, description)
            return transaction.id;
        } catch (error) {
            logger.error(`Exception return from SDK while requesting creation of a transaction for company number [${companyName}].`);
            throw new Error("Issue with service")
        }

    }

}


export function getFileUploadUrl(req: Request): string{
    const zipPortalBaseURL = `${req.protocol}://${req.get('host')}`;
    const zipPortalCallbackUrl = encodeURIComponent(`${zipPortalBaseURL}${servicePathPrefix}${uploadedUrl}/${fileIdPlaceholder}`);
    const xbrlValidatorBackUrl = encodeURIComponent(zipPortalBaseURL + servicePathPrefix);

    return `${env.SUBMIT_VALIDATION_URL}?callback=${zipPortalCallbackUrl}&backUrl=${xbrlValidatorBackUrl}`;
}
