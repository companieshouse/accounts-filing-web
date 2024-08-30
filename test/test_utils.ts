import { env } from '../src/config';

export type EnvKey = keyof typeof env;

/**
 * Sets multiple environment variables for testing purposes and returns a cleanup function.
 *
 * @param {Record<EnvKey, any>} envVars - An object containing environment variable keys and their corresponding values.
 * @returns {Function} A cleanup function that restores the original values of the environment variables.
 *
 * @example
 * const resetEnv = setEnvVars({
 *   NODE_ENV: 'test',
 *   API_KEY: 'test-key'
 * });
 * // Run tests...
 * resetEnv(); // Restores the original values of NODE_ENV and API_KEY
 */
export function setEnvVars(envVars: Partial<Record<EnvKey, any>>): () => void {
    const originalValues: Partial<Record<EnvKey, any>> = {};

    for (const [key, value] of Object.entries(envVars)) {
        originalValues[key as EnvKey] = env[key as EnvKey];
        env[key] = value;
    }

    return () => {
        for (const key of Object.keys(envVars)) {
            env[key] = originalValues[key as EnvKey];
        }
    };
}
