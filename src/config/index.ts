import { Validators, readEnv, addProtocolIfMissing } from "./validator";

const { str, url, bool, port } = Validators;

export const env = readEnv(process.env, {
    CHS_URL: url.describe("This host URL for CHS"),
    NUNJUCKS_LOADER_WATCH: bool
        .describe(
            "Flag to enable or disable watching for file changes in the Nunjucks loader"
        )
        .default(false),
    NUNJUCKS_LOADER_NO_CACHE: bool
        .describe(
            "Flag to control the caching of templates in the Nunjucks loader"
        )
        .default(false),
    CDN_URL_CSS: str.describe("CDN URL for the CSS files").default("/css"),
    CDN_URL_JS: str.describe("CDN URL for the JavaScript files").default("/js"),
    CDN_HOST: str.map(addProtocolIfMissing).describe("URL for the CDN"),
    PORT: port.describe("Port to run the web server on").default(3000),
    NODE_HOSTNAME: str
        .describe("Host name the server is hosted on")
        .default(""),
    NODE_SSL_ENABLED: str
        .describe("Flag to enable SSL for the server")
        .default(false),
    NODE_SSL_PRIVATE_KEY: str
        .describe("Path to the SSL private key file")
        .default(""),
    NODE_SSL_CERTIFICATE: str.describe('Path to the SSL certificate file').default(''),
    NODE_PORT_SSL: port.describe('Port for the HTTPS server').default(3001),
    NODE_HOSTNAME_SECURE: str.describe('Hostname for the secure HTTPS server').default('localhost'),
    CACHE_SERVER: str.describe('Cache server URL'),
    COOKIE_DOMAIN: str.describe('Domain for cookies'),
    COOKIE_NAME: str.describe('Name for the cookie'),
    COOKIE_SECRET: str.describe('Secret used for cookie encryption'),
    APP_NAME: str.describe('Name of the application').default('accounts-filing-web'),
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
    SUBMIT_VALIDATION_URL: url.describe('account validation web submit address to upload file for validation')
});
