import { Validators, readEnv, addProtocolIfMissing } from "./validator";

const { str, url, bool, port } = Validators;

export const env = readEnv(process.env, {
    API_URL: url.describe("API base URL for service interaction"),
    APP_NAME: str.describe('Name of the application').default('accounts-filing-web'),
    CACHE_SERVER: str.describe('Cache server URL'),
    CDN_HOST: str.map(addProtocolIfMissing).describe("URL for the CDN"),
    CDN_URL_CSS: str.describe("CDN URL for the CSS files").default("/css"),
    CDN_URL_JS: str.describe("CDN URL for the JavaScript files").default("/js"),
    CHS_API_KEY: str.describe("API key for CHS service"),
    CHS_INTERNAL_API_KEY: str.describe("API key with internal app privileges"),
    CHS_URL: url.describe("This host URL for CHS"),
    COOKIE_DOMAIN: str.describe('Domain for cookies'),
    COOKIE_NAME: str.describe('Name for the cookie'),
    COOKIE_SECRET: str.describe('Secret used for cookie encryption'),
    INTERNAL_API_URL: url.describe("Internal API base URL for internal service interaction"),
    LOG_LEVEL: str
        .in([
            'ALL', 'TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL', 'MARK', 'OFF',
            'all', 'trace', 'debug', 'info', 'warn', 'error', 'fatal', 'mark', 'off'
        ])
        .describe(
            'Defines the level of events to be logged. Options are: ' +
                'ALL/all (all events will be logged), ' +
                'TRACE/trace (trace level events will be logged), ' +
                'DEBUG/debug (debug level events will be logged), ' +
                'INFO/info (information level events will be logged), ' +
                'WARN/warn (warnings will be logged), ' +
                'ERROR/error (errors will be logged), ' +
                'FATAL/fatal (only fatal errors will be logged), ' +
                'MARK/mark (used for particular important log events), ' +
                'OFF/off (no events will be logged). ' +
                'The order from least to most severe is: ALL < TRACE < DEBUG < INFO < WARN < ERROR < FATAL < MARK < OFF. ' +
                'OFF is intended to be used to turn off logging, not as a level for actual logging.'
        )
        .default('info'),
    SUBMIT_VALIDATION_URL: url.describe('Account validator web submit path to upload file to be validated')
});
