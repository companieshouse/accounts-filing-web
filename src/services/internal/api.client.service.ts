import { env } from "../../config";
import { createApiClient } from "@companieshouse/api-sdk-node/dist";
import ApiClient from "@companieshouse/api-sdk-node/dist/client";
import { createPrivateApiClient } from "private-api-sdk-node";
import PrivateApiClient from "private-api-sdk-node/dist/client";
import { createAndLogError, logger } from "../../utils/logger";
import { ApiErrorResponse, ApiResponse } from "@companieshouse/api-sdk-node/dist/services/resource";
import { getAccessToken } from "../../utils/session";
import { Session } from "@companieshouse/node-session-handler";

/**
 * Creates an instance of the OAuth API client using a session object.
 *
 * @param {Session} session - The session object that contains the OAuth access token.
 * @returns An instance of the OAuth API client.
 * @throws Will throw an error if unable to access the OAuth token.
 */
export function createPublicOAuthApiClient(session: Session): ApiClient {
    const oAuthAccessToken =
        session.data.signin_info?.access_token?.access_token;
    if (oAuthAccessToken) {
        return createApiClient(undefined, oAuthAccessToken, env.API_URL);
    }

    throw createAndLogError("Error creating public OAuth API client. Unable to access OAuth token.");
}


/**
 * Creates an instance of the private API client using the CHS internal API key.
 *
 * @returns An instance of the private API client.
 */
export function createPrivateApiKeyClient(): PrivateApiClient {
    logger.info(
        `Creating private API client with key ${maskString(
            env.CHS_INTERNAL_API_KEY
        )}`
    );
    return createPrivateApiClient(
        env.CHS_INTERNAL_API_KEY,
        undefined,
        env.INTERNAL_API_URL
    );
}

/**
 * Creates an instance of the API client using users OAuth tokens.
 * @param session
 * @returns An instance of the API client
 */
export const createOAuthApiClient = (session: Session | undefined): ApiClient => {
    if (session === undefined) {
        throw new Error("Session undefined");
    }
    return createApiClient(undefined, getAccessToken(session), env.API_URL);
};

/**
 * Masks a string by replacing characters after a specified position with a mask character.
 *
 * @param s - The input string to be masked.
 * @param n - The number of characters to preserve at the beginning of the string (default: 5).
 * @param mask - The character used for masking (default: '*').
 * @returns The masked string with characters after the specified position replaced by the mask character.
 *
 * @example
 * const input = "Hello, world!";
 * const masked = maskString(input);
 * console.log(masked); // Output: "Hello,******"
 */
function maskString(s: string, n = 5, mask = "*"): string {
    return [...s].map((char, index) => (index < n ? char : mask)).join("");
}

/**
 * Executes a given API call function using an OAuth authorized API client.
 *
 * This function handles the creation of the ApiClient with the current session's credentials and
 * then performs the API call by invoking the provided function `fn`. If the API response status code
 * indicates an unauthorized request (HTTP 401), there is potential to retry the call with a refreshed token;
 * however, this functionality is currently commented out and would need to be implemented in the future if required.
 *
 * @param session - The session object containing authentication details.
 * @param fn - A function that takes an ApiClient as an argument and returns a Promise of ApiResponse or ApiErrorResponse.
 * @returns The Promise of ApiResponse or ApiErrorResponse resulting from the API call function.
 */
export async function makeApiCall(session: Session, fn: (apiClient: ApiClient) => Promise<ApiResponse<unknown> | ApiErrorResponse>): Promise<ApiResponse<unknown> | ApiErrorResponse> {
    const client = createPublicOAuthApiClient(session);

    const response = await fn(client);

    // TODO: this code was copied from the overseas entity web service. They had this code to retry the API call if it failed with a refreshed OAUTH token.
    // For now this isn't necessary but may be in the future, so the retry code has been left in for now, but commented out.
    // if (response && response.httpStatusCode === 401) {
    // const responseMsg = `Retrying call on after unauthorised response`;
    // logger.debug(`${responseMsg} - ${JSON.stringify(response)}`);

    // const accessToken = await refreshToken(session);
    // logger.debug(`New access token: ${accessToken}`);

    // client = createPublicOAuthApiClient(session);
    // response = await fn(client);
    // }

    // logger.debug("Call successful.");

    return response;
}

export const defaultPrivateApiClient = createPrivateApiKeyClient();
