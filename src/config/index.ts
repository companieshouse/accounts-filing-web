import { cleanEnv, str, url, bool, port } from "envalid";

export const env = cleanEnv(process.env, {
    CHS_URL: url({
        desc: "This host URL for CHS",
        example: "http://chs.local",
    }),
    NUNJUCKS_LOADER_WATCH: bool({
        desc: "Flag to enable or disable watching for file changes in the Nunjucks loader",
        default: false,
    }),
    NUNJUCKS_LOADER_NO_CACHE: bool({
        desc: "Flag to control the caching of templates in the Nunjucks loader",
        default: false,
    }),
    CDN_URL_CSS: str({
        desc: "CDN URL for the CSS files",
        default: "/css",
    }),
    CDN_URL_JS: str({
        desc: "CDN URL for the JavaScript files",
        default: "/js",
    }),
    CDN_HOST: url({
        desc: "URL for the CDN",
    }),
    NODE_PORT: port({
        desc: "Port to run the web server on",
        default: 3000
    }),
    NODE_HOSTNAME: str({
        desc: "Host name the server is hosted on",
        default: ""
    }),
    NODE_SSL_ENABLED: str({
        desc: "Flag to enable SSL for the server",
        default: "OFF",
    }),
    NODE_SSL_PRIVATE_KEY: str({
        desc: "Path to the SSL private key file",
        default: "",
    }),
    NODE_SSL_CERTIFICATE: str({
        desc: "Path to the SSL certificate file",
        default: "",
    }),
    NODE_PORT_SSL: port({
        desc: "Port for the HTTPS server",
        default: 3001,
    }),
    NODE_HOSTNAME_SECURE: str({
        desc: "Hostname for the secure HTTPS server",
        default: "localhost",
    }),
    CACHE_SERVER: str({
        desc: "Cache server URL",
    }),
    COOKIE_DOMAIN: str({
        desc: "Domain for cookies",
    }),
    COOKIE_NAME: str({
        desc: "Name for the cookie",
    }),
    COOKIE_SECRET: str({
        desc: "Secret used for cookie encryption",
    }),
    APP_NAME: str({
        desc: "Name of the application",
        default: "accounts-filing-web"
    }),
    LOG_LEVEL: str({
        choices: ['ALL', 'TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL', 'MARK', 'OFF', 
                  'all', 'trace', 'debug', 'info', 'warn', 'error', 'fatal', 'mark', 'off'],
        desc: 'Defines the level of events to be logged. Options are: ' +
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
            'OFF is intended to be used to turn off logging, not as a level for actual logging.',
        default: 'info',
    })
});
