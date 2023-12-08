import { env } from "../../config";
import { createApiClient } from "@companieshouse/api-sdk-node/dist";
import ApiClient from "@companieshouse/api-sdk-node/dist/client";
import { createPrivateApiClient } from "private-api-sdk-node";
import PrivateApiClient from "private-api-sdk-node/dist/client";
import { logger } from "../../utils/logger";

/**
 * Creates an instance of the public API client using the CHS API key.
 *
 * @returns An instance of the public API client.
 */
export const createPublicApiKeyClient = (): ApiClient => {
    return createApiClient(env.CHS_API_KEY, undefined, env.API_URL);
};

/**
 * Creates an instance of the private API client using the CHS internal API key.
 *
 * @returns An instance of the private API client.
 */
export const createPrivateApiKeyClient = (): PrivateApiClient => {
    logger.info(`Creating private API client with key ${maskString(env.CHS_INTERNAL_API_KEY)}`);
    return createPrivateApiClient(env.CHS_INTERNAL_API_KEY, undefined, env.INTERNAL_API_URL);
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

export const defaultPrivateApiClient = createPrivateApiKeyClient();
