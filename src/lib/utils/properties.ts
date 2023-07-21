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

export const ACCOUNT_URL = getEnvironmentVariable("ACCOUNT_URL");
export const CHS_URL = getEnvironmentVariable("CHS_URL");