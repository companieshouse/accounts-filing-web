import { Request, Response } from "express";
import { BaseViewData, GenericHandler } from "./../generic";
import { logger } from "../../../utils/logger";
import { validate as uuidValidate } from "uuid";
import { AccountsFilingService } from "../../../services/external/accounts.filing.service";
import { getAccountsFilingId, getPackageType, getTransactionId, getUserEmail, setValidationResult } from "../../../utils/session";
import { constructValidatorRedirect } from "../../../utils/url";
import { AccountsFilingValidationRequest } from "@companieshouse/api-sdk-node/dist/services/accounts-filing/types";
import { AccountValidatorResponse } from "@companieshouse/api-sdk-node/dist/services/account-validator/types";
import { addLangToUrl, getLocalesField, Language, selectLang } from "../../../utils/localise";

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

    constructor(private readonly accountsFilingService: AccountsFilingService) {
        super({
            title: "Uploaded Handler for handling file upload callbacks",
            viewName: "uploaded",
            backURL: null,
            userEmail: null
        });
    }

    getViewData(req: Request) {
        const language: Language = selectLang(req.query.lang);
        super.populateViewData(req);

        const userEmail = getUserEmail(req.session);
        if (userEmail instanceof Error) {
            throw userEmail;
        }

        this.baseViewData.backURL = addLangToUrl(constructValidatorRedirect(req), language);
        this.baseViewData.userEmail = userEmail;
        this.baseViewData.title = getLocalesField("uploaded_title", req);

        return {
            ...this.baseViewData
        };
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
    async executeGet(
        req: Request,
        _response: Response
    ): Promise<UploadedViewData> {
        logger.debug(`Handling GET request for uploaded file.`);

        const fileId = req.params.fileId;

        const accountsFilingId = getAccountsFilingId(req?.session);
        const transactionId = getTransactionId(req?.session);
        const packageType = getPackageType(req?.session);

        if (accountsFilingId instanceof Error) {
            throw accountsFilingId;
        }
        if (transactionId instanceof Error) {
            throw transactionId;
        }
        if (packageType instanceof Error) {
            throw packageType;
        }

        const validationRequest = {
            fileId,
            accountsFilingId,
            transactionId
        };

        if (!this.validateRequest(validationRequest)) {
            logger.error(`File ID [${fileId}] is not valid.`);

            return {
                ...this.getViewData(req),
            };
        }

        try {
            const result = await this.accountsFilingService.getValidationStatus(validationRequest);
            const validationResult = result.resource;
            if (validationResult === undefined) {
                throw new Error(`Validation result response empty`);
            }

            setValidationResult(req.session, validationResult);

            logger.debug(
                `Got result ${JSON.stringify(result, null, 2)} for file [${fileId}]`
            );

            return {
                ...this.getViewData(req),
                result: validationResult
            };
        } catch (error) {
            logger.error(`Exception returned from SDK while getting validation status from [${fileId}]. Error: ${JSON.stringify(error, null, 2)}`);

            throw error;
        }
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

}
