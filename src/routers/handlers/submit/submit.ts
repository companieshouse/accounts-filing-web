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

    async execute (req: Request, _res: Response): Promise<String> {
        logger.info(`GET Request to send fileId call back address`);

        var companyNumber = req.session?.getExtraData<string>(ContextKeys.COMPANY_NUMBER) as string;
        var transactionId = req.session?.getExtraData<string>(ContextKeys.TRANSACTION_ID) as string;

        let result: Awaited<ReturnType<typeof this.accountsFilingService.checkCompany>>;
        try {
            result = await this.accountsFilingService.checkCompany(companyNumber, transactionId);
            const accountsFilingId = req.session?.setExtraData(ContextKeys.ACCOUNTS_FILING_ID, result.resource?.accountsFilingId)
        } catch (error) {
            logger.error(`Exception returned from SDK while confirming company for company number - [${companyNumber}]. Error: ${JSON.stringify(error, null, 2)}`);
            throw error;
        }
        logger.info(
            `Got result ${JSON.stringify(result, null, 2)} for company number - [${companyNumber}]`
        );
        
        return getFileUploadUrl(req);
    }
}


export function getFileUploadUrl(req: Request): string{
    const zipPortalBaseURL = `${req.protocol}://${req.get('host')}`;
    const zipPortalCallbackUrl = encodeURIComponent(`${zipPortalBaseURL}${servicePathPrefix}${uploadedUrl}/${fileIdPlaceholder}`);
    const xbrlValidatorBackUrl = encodeURIComponent(zipPortalBaseURL + servicePathPrefix);

    return `${env.SUBMIT_VALIDATION_URL}?callback=${zipPortalCallbackUrl}&backUrl=${xbrlValidatorBackUrl}`;
}
