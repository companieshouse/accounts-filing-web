/**
 * Gets an environment variable. If the env var is not set and a default value is not
 * provided, then it is assumed it is a mandatory requirement and an error will be
 * thrown.
 */

const getEnvironmentVariable = (key: string, defaultValue?: unknown): string => {
    const isMandatory = !defaultValue;
    const value: string = process.env[key] || "";

    if (!value && isMandatory){
        throw new Error(`Please, set the environment variable "${key}"`);
    }

    return value || defaultValue as string;
}

export const ACCOUNT_URL = getEnvironmentVariable('ACCOUNT_URL');

export const CHS_URL = getEnvironmentVariable('CHS_URL');

export const ACCOUNTS_FILING_WEB_ACTIVE = getEnvironmentVariable('ACCOUNTS_FILING_WEB_ACTIVE', 'false');

export const CACHE_SERVER = getEnvironmentVariable("CACHE_SERVER");

export const COOKIE_NAME = getEnvironmentVariable("COOKIE_NAME");
  
export const COOKIE_DOMAIN = getEnvironmentVariable("COOKIE_DOMAIN");

export const COOKIE_SECRET = getEnvironmentVariable("COOKIE_SECRET");

export const PIWIK_START_GOAL_ID = getEnvironmentVariable("PIWIK_START_GOAL_ID");

export const URL_LOG_MAX_LENGTH: number = parseInt(getEnvironmentVariable("URL_LOG_MAX_LENGTH", "400"), 10);
  
export const URL_PARAM_MAX_LENGTH: number = parseInt(getEnvironmentVariable("URL_PARAM_MAX_LENGTH", "50"), 10);