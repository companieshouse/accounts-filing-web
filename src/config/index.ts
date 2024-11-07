import { Validators, readEnv, addProtocolIfMissing } from "./validator";

const { str, url, bool, port, int } = Validators;

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
    CIC_FEE: str.describe("Fee for CIC package submissions"),
    CIC_DISABLE_RADIO: bool
        .describe("Flag to disable the CIC option on the accounts submission page")
        .default(false),
    CONTACT_US_LINK: str
        .describe("Link to contact us")
        .default(
            "https://www.gov.uk/government/organisations/companies-house#org-contacts"
        ),
    COOKIE_DOMAIN: str.describe('Domain for cookies'),
    COOKIE_NAME: str.describe('Name for the cookie'),
    COOKIE_SECRET: str.describe('Secret used for cookie encryption'),
    DEVELOPERS_LINK: str
        .describe("Link for developers")
        .default("https://developer.companieshouse.gov.uk/"),
    FEEDBACK_LINK: url.describe("Link to feedback form for the service"),
    DISABLE_AUDIT_EXEMPT_SUBSIDIARY_ACCOUNTS_RADIO: bool.describe('Flag to disable Audit Exempt subsidiary accounts'),
    DISABLE_DORMANT_EXEMPT_SUBSIDIARY_ACCOUNTS_RADIO: bool.describe('Flag to disable Dormant exempt (Filing) subsidiary accounts'),
    DISABLE_OVERSEAS_COMPANY_ACCOUNTS_RADIO: bool.describe('Flag to disable Overseas company accounts'),
    DISABLE_GROUP_SECTION_400_UK_PARENT_ACCOUNTS_RADIO: bool.describe('Flag to disable Group - section 400 parent incorporated under UK law accounts'),
    DISABLE_GROUP_SECTION_401_NON_UK_PARENT_ACCOUNTS_RADIO: bool.describe('Flag to disable Group - section 401 parent incorporated under non UK law accounts'),
    DISABLE_LIMITED_PARTNERSHIP_ACCOUNTS_RADIO: bool.describe('Flag to disable Limited Partnership accounts'),
    INTERNAL_API_URL: url.describe("Internal API base URL for internal service interaction"),
    LOCALES_PATH: str
        .describe("The name of the directory where the locales files are stored")
        .default("locales"),
    LOCALES_ENABLED: bool
        .describe("feature flag that toggles localisation behaviour")
        .default(false),
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
    NODE_HOSTNAME: str
        .describe("Host name the server is hosted on")
        .default(""),
    NODE_HOSTNAME_SECURE: str.describe('Hostname for the secure HTTPS server').default('localhost'),
    NODE_PORT_SSL: port.describe('Port for the HTTPS server').default(3001),
    NODE_SSL_CERTIFICATE: str.describe('Path to the SSL certificate file').default(''),
    NODE_SSL_ENABLED: str
        .describe("Flag to enable SSL for the server")
        .default(false),
    NODE_SSL_PRIVATE_KEY: str
        .describe("Path to the SSL private key file")
        .default(""),
    NUNJUCKS_LOADER_NO_CACHE: bool
        .describe(
            "Flag to control the caching of templates in the Nunjucks loader"
        )
        .default(false),
    NUNJUCKS_LOADER_WATCH: bool
        .describe(
            "Flag to enable or disable watching for file changes in the Nunjucks loader"
        )
        .default(false),
    OVERSEAS_FEE: str.describe("Fee for overseas package accounst submissions"),
    PORT: port.describe("Port to run the web server on").default(3000),
    PIWIK_URL: url.describe('The URL for the matomo instance'),
    PIWIK_SITE_ID: int.describe('The site ID for matomo'),
    PIWIK_START_GOAL_ID: int.describe('The start button goal id'),
    POLICIES_LINK: str
        .describe("Link to policies")
        .default("http://resources.companieshouse.gov.uk/legal/termsAndConditions.shtml"),
    SUBMIT_VALIDATION_URL: url.describe('Account validator web submit path to upload file to be validated'),
    FEATURE_FLAG_ZIP_PORTAL_270924: bool.describe("Feature flag for enabling zip portal")
});
