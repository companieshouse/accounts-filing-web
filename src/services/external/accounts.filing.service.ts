import { Resource } from "@companieshouse/api-sdk-node";
import { createAndLogError, logger } from "../../utils/logger";
import { AccountValidatorResponse } from "private-api-sdk-node/dist/services/account-validator/types";
import { getAccountsFilingId, getPackageType, getTransactionId, must } from "../../utils/session";
import { Session } from "@companieshouse/node-session-handler";
import { AccountsFilingCompanyResponse, AccountsFilingValidationRequest, ConfirmCompanyRequest } from "@companieshouse/api-sdk-node/dist/services/accounts-filing/types";
import { makeApiKeyCall } from "../../services/internal/api.client.service";


export class AccountsFilingService {
    /**
     * Asynchronously retrieves the validation status of an accounts filing request.
     *
     * @param {AccountsFilingValidationRequest} req - The request containing the fileId to be validated.
     * @returns {Promise<Resource<AccountValidatorResponse>>} A promise resolving to the account validation response.
     * @throws {Error} Throws an error if the response status is not 200 or if no resource is included in the response.
     */
    async getValidationStatus(
        req: AccountsFilingValidationRequest
    ): Promise<Resource<AccountValidatorResponse>> {
        const fileId = req.fileId;
        logger.debug(`Getting validation status for file ${fileId}`);

        const accountValidatorResponse = await makeApiKeyCall(async apiClient => {
            return await apiClient.accountsFilingService.checkAccountsFileValidationStatus(req);
        });

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

    /**
     * This service will get account filing id when the given company is confimed.
     * @param companyNumber The company number
     * @param transactionId The transaction Id
     * @returns the company response.
     */
    async checkCompany(
        companyNumber: string,
        transactionId: string,
        confirmCompanyRequest: ConfirmCompanyRequest
    ): Promise<Resource<AccountsFilingCompanyResponse>> {

        const accountsFilingCompanyResponse = await makeApiKeyCall(async apiClient => {
            return await apiClient.accountsFilingService.confirmCompany(
                companyNumber,
                transactionId,
                confirmCompanyRequest
            );
        });

        logger.debug(
            `Confirm company Response : ${JSON.stringify(
                accountsFilingCompanyResponse,
                null,
                2
            )}`
        );

        if (accountsFilingCompanyResponse.httpStatusCode !== 200) {
            logger.error(`Confirm company failed. ${JSON.stringify(accountsFilingCompanyResponse, null, 2)}`);
            throw accountsFilingCompanyResponse;
        }

        if (!isResource(accountsFilingCompanyResponse)) {
            logger.error(`company response did not include a resource. Response: ${JSON.stringify(accountsFilingCompanyResponse, null, 2)}`);
            throw new Error("company response didn't return a resource");
        }

        return accountsFilingCompanyResponse;
    }


    /**
     * Sets the package accounts type of a transaction by making a PUT request to the accounts-filing-api
     * via the private-api-sdk-node library. If the request fails, an Error is thrown.
     *
     * @param {Session | undefined} session - The request session, used to retrieve the transactionId and accountsFilingId.
     * @throws Will throw an error if the transactionId, packageType or accountsFilingId cannot be retrieved from the session,
     * or if the API call to set the package accounts type is unsuccessful.
     */
    public async setTransactionPackageType(session: Session | undefined) {
        try {
            const transactionId = must(getTransactionId(session));
            const accountsFilingId = must(getAccountsFilingId(session));
            const packageType = must(getPackageType(session));

            const resp = await makeApiKeyCall(async apiClient => {
                return await apiClient.accountsFilingService.setPackageType(transactionId, accountsFilingId, packageType);
            });

            // If the call fails resp.value is an Error object with an error message, so we throw it.
            // If it succeeded we just return undefined.
            if (resp.isFailure()) {
                throw resp.value;
            }
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : `${error}`;
            throw createAndLogError(`Failed to set package accounts type. Error occurred while trying to retrieve transactionId or accountsFilingId: ${errMsg}`);
        }
    }
}

function isResource(o: any): o is Resource<unknown> {
    return o !== null && o !== undefined && "resource" in o;
}

export const defaultAccountsFilingService = new AccountsFilingService();
