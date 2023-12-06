import PrivateApiClient from "private-api-sdk-node/dist/client";
import { Resource } from "@companieshouse/api-sdk-node";
import { logger } from "../../utils/logger";
import { AccountValidatorResponse } from "private-api-sdk-node/dist/services/account-validator/types";
import { defaultPrivateApiClient } from "../../services/internal/api.client.service";
import { AccountsFilingValidationRequest } from "private-api-sdk-node/dist/services/accounts-filing/types";


export class AccountsFilingService {
    constructor(private privateApiClient: PrivateApiClient) {}

    /**
     * Asynchronously retrieves the validation status of an accounts filing request.
     *
     * @param {AccountsFilingValidationRequest} req - The request containing the fileId to be validated.
     * @returns {Promise<Resource<AccountValidatorResponse>>} A promise resolving to the account validation response.
     * @throws {Error} Throws an error if the response status is not 200 or if no resource is included in the response.
     */
    async getValidationStatus(req: AccountsFilingValidationRequest): Promise<Resource<AccountValidatorResponse>> {
        const fileId = req.fileId;
        logger.debug(`Getting validation status for file ${fileId}`);

        const accountsFilingService = this.privateApiClient.accountsFilingService;
        const accountValidatorResponse = await accountsFilingService.checkAccountsFileValidationStatus(req);

        logger.debug(`Response for ${fileId}: ${JSON.stringify(accountValidatorResponse, null, 2)}`);

        if (accountValidatorResponse.httpStatusCode !== 200) {
            logger.error(`Non 200 response from account validator API. ${JSON.stringify(accountValidatorResponse, null, 2)}`);
            throw accountValidatorResponse;
        }

        if (!isResource(accountValidatorResponse)) {
            logger.error(`Account validator response did not include a resource. Response: ${JSON.stringify(accountValidatorResponse, null, 2)}`);
            throw new Error("Account validator didn't return a resource");
        }

        return accountValidatorResponse;
    }
}

function isResource(o: any): o is Resource<unknown> {
    return o !== null && o !== undefined && 'resource' in o;
}

export const defaultAccountsFilingService = new AccountsFilingService(defaultPrivateApiClient);
