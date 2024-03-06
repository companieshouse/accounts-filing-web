import { logger } from "../../../utils/logger";
import { GenericHandler } from "../generic";
import { env } from "../../../config";
import { fileIdPlaceholder, servicePathPrefix, uploadedUrl } from "../../../utils/constants/urls";
import { Request, Response } from "express";
import { ContextKeys } from "../../../utils/constants/context.keys";
import { AccountsFilingService } from "services/external/accounts.filing.service";

export class SubmitHandler extends GenericHandler {
    constructor (private accountsFilingService: AccountsFilingService) {
        super({
            title: '',
            backURL: `${servicePathPrefix}`
        });
    }

    async execute (req: Request, _res: Response): Promise<string> {
        logger.info(`GET Request to send fileId call back address`);
        
       // getTestingData(req); // need to remove.

        const companyNumber = req.session?.getExtraData<string>(ContextKeys.COMPANY_NUMBER);
        if(companyNumber===undefined){
            throw new Error("Company number in undefined");
        }
        const transactionId = req.session?.getExtraData<string>(ContextKeys.TRANSACTION_ID);
        if(transactionId===undefined){
            throw new Error("transaction Id in undefined");
        }

        try {
            const result = await this.accountsFilingService.checkCompany(companyNumber, transactionId);
            if (result.httpStatusCode !== 200) {
                logger.error(`check company failed. ${JSON.stringify(result, null, 2)}`);
                throw result;
            }

            req.session?.setExtraData(ContextKeys.ACCOUNTS_FILING_ID, result.resource?.accountsFilingId);

        } catch (error) {
            logger.error(`Exception returned from SDK while confirming company for company number - [${companyNumber}]. Error: ${JSON.stringify(error, null, 2)}`);
            throw error;
        }

        return getFileUploadUrl(req);
    }
}


export function getFileUploadUrl(req: Request): string{
    const zipPortalBaseURL = `${req.protocol}://${req.get('host')}`;
    const zipPortalCallbackUrl = encodeURIComponent(`${zipPortalBaseURL}${servicePathPrefix}${uploadedUrl}/${fileIdPlaceholder}`);
    const xbrlValidatorBackUrl = encodeURIComponent(zipPortalBaseURL + servicePathPrefix);

    logger.info(`${env.SUBMIT_VALIDATION_URL}?callback=${zipPortalCallbackUrl}&backUrl=${xbrlValidatorBackUrl}`);

    return `${env.SUBMIT_VALIDATION_URL}?callback=${zipPortalCallbackUrl}&backUrl=${xbrlValidatorBackUrl}`;
}

//TODO: Once the transaction Id and company number are avaliable in session
//then we need to delete this function. This is only for dev development and testing to get rid of undefined error.
// need to remove later.
function getTestingData(req: Request){
    req.session?.setExtraData(ContextKeys.COMPANY_NUMBER, "00006400");
    req.session?.setExtraData(ContextKeys.TRANSACTION_ID, "000000-123456-000000");

    return req;
}