import { Request, Response } from "express";
import { BaseViewData, GenericHandler } from "./../generic";
import { logger } from "../../../utils/logger";
import { validate as uuidValidate } from "uuid";
import { AccountsFilingService } from "../../../services/external/accounts.filing.service";
import { AccountValidatorResponse } from "private-api-sdk-node/dist/services/account-validator/types";
import { AccountsFilingValidationRequest } from "private-api-sdk-node/dist/services/accounts-filing/types";
import { env } from "../../../config";
import { ContextKeys } from "../../../utils/constants/context.keys";
import { fileIdPlaceholder, servicePathPrefix, uploadedUrl } from "../../../utils/constants/urls";

/**
 * Interface representing the view data for an uploaded file, extending from BaseViewData.
 */
interface UploadedViewData extends BaseViewData {
    /**
     * The result of the account validation process, if available.
     */
    result?: AccountValidatorResponse;
}

export class UploadedHandler extends GenericHandler {
    constructor(private accountsFilingService: AccountsFilingService) {
        super({
            title: "Uploaded Handler for handling file upload callbacks",
            backURL: null,
        });
    }

    /**
     * Asynchronously handles a callback request from an external service after a file upload and validation.
     * This method is triggered as a response to a file upload completion and validation by another service.
     * It first validates the file ID received in the request parameters. If valid, it retrieves the
     * validation status of the file from the accounts filing service and returns the relevant view data.
     *
     * @param {Request} req - The incoming request object, containing the file ID and other request data.
     * @param {Response} _response - The response object (unused in this method).
     * @returns {Promise<UploadedViewData>} A promise that resolves to the view data for the processed file.
     *         This data includes the base view data and, if the file ID is valid, the result of the file validation.
     */
    async execute(
        req: Request,
        _response: Response
    ): Promise<UploadedViewData> {
        super.populateViewData(req);
        this.baseViewData.backURL = this.getFileUploadUrl(req);

        logger.debug(`Handling GET request for uploaded file.`);

        const fileId = req.params.fileId;
        // TODO: remove nullish coalescing once the variables have been populated.
        const accountsFilingId =
            req.session?.getExtraData<string>(ContextKeys.ACCOUNTS_FILING_ID) ?? "Placeholder accountsFilingId";
        const transactionId =
            req.session?.getExtraData<string>(ContextKeys.TRANSACTION_ID) ?? "Placeholder transactionId";

        const validationRequest = {
            fileId,
            accountsFilingId,
            transactionId
        };

        if (!this.validateRequest(validationRequest)) {
            logger.error(`File ID [${fileId}] is not valid.`);

            return {
                ...this.baseViewData,
            };
        }

        let result: Awaited<ReturnType<typeof this.accountsFilingService.getValidationStatus>>;
        try {
            result = await this.accountsFilingService.getValidationStatus(validationRequest);
        } catch (error) {
            logger.error(`Exception returned from SDK while getting validation status from [${fileId}]. Error: ${JSON.stringify(error, null, 2)}`);

            throw error;
        }

        logger.info(
            `Got result ${JSON.stringify(result, null, 2)} for file [${fileId}]`
        );

        return {
            ...this.baseViewData,
            result: result.resource,
        };
    }

    /**
     * Validates the provided request parameters.
     * This method checks if the file ID is a valid version 4 UUID (v4 UUID),
     * and ensures that both the accounts filing ID and transaction ID are non-empty strings.
     * The v4 UUID check matches the format used by the file transfer service.
     *
     * @param {AccountsFilingValidationRequest} request - The request object containing the file ID,
     *                                                    accounts filing ID, and transaction ID.
     * @returns {boolean} True if all validations pass: file ID is a valid v4 UUID,
     *                    and both accounts filing ID and transaction ID are non-empty strings.
     */
    private validateRequest({
        fileId,
        accountsFilingId,
        transactionId,
    }: AccountsFilingValidationRequest): boolean {
        const fileIdValid = uuidValidate(fileId);

        const filingIdValid =
            typeof accountsFilingId === "string" &&
            accountsFilingId.trim() !== "";
        const transactionIdValid =
            typeof transactionId === "string" && transactionId.trim() !== "";

        return fileIdValid && filingIdValid && transactionIdValid;
    }

    private getFileUploadUrl(req: Request): string{
        const zipPortalBaseURL = `${req.protocol}://${req.get('host')}`;
        const zipPortalCallbackUrl = encodeURIComponent(`${zipPortalBaseURL}${servicePathPrefix}${uploadedUrl}/${fileIdPlaceholder}`);
        const xbrlValidatorBackUrl = encodeURIComponent(zipPortalBaseURL + servicePathPrefix);

        return `${env.SUBMIT_VALIDATION_URL}?callback=${zipPortalCallbackUrl}&backUrl=${xbrlValidatorBackUrl}`;
    }
}
