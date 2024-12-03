import express from "express";
import * as nunjucks from "nunjucks";
import * as path from "path";
import { logger } from "./utils/logger";
import cookieParser from "cookie-parser";
import routerDispatch from "./router.dispatch";
import { env } from './config';
import { SIGN_OUT, servicePathPrefix } from "./utils/constants/urls";
import { formatToUKString, formatType } from "./utils/format/format";

const app = express();
app.disable("x-powered-by");

app.set("views", [
    path.join(__dirname, "views"),
    path.join(__dirname, "node_modules/govuk-frontend"),
    path.join(__dirname, "node_modules/@companieshouse/"),
    path.join(__dirname, "../node_modules/@companieshouse/"),
    path.join(__dirname, "../node_modules/govuk-frontend"), // This if for when using ts-node since the working directory is src
    path.join(__dirname, "node_modules/govuk-frontend/components"),
    path.join(__dirname, "node_modules/@companieshouse/ch-node-utils/templates"),
    path.join(__dirname, "../node_modules/@companieshouse/ch-node-utils/templates")
]);

const nunjucksLoaderOpts = {
    watch: env.NUNJUCKS_LOADER_WATCH,
    noCache: env.NUNJUCKS_LOADER_NO_CACHE
};

const njk = new nunjucks.Environment(
    new nunjucks.FileSystemLoader(app.get("views"),
                                  nunjucksLoaderOpts)
);

njk.express(app);
app.set("view engine", "njk");

// Serve static files
app.use(express.static(path.join(__dirname, "../assets/public"))); // TODO: only in dev mode
// app.use("/assets", express.static("./../node_modules/govuk-frontend/govuk/assets"));

njk.addGlobal("cdnUrlCss", env.CDN_HOST + env.CDN_URL_CSS);
njk.addGlobal("cdnUrlJs", env.CDN_HOST + env.CDN_URL_JS);
njk.addGlobal("cdnHost", env.CDN_HOST);
njk.addGlobal("chsUrl", env.CHS_URL);
njk.addGlobal("signoutURL", SIGN_OUT);
njk.addGlobal("contactUs", env.CONTACT_US_LINK);
njk.addGlobal("developerLink", env.DEVELOPERS_LINK);
njk.addGlobal("policies", env.POLICIES_LINK);
njk.addGlobal("feedbackLink", env.FEEDBACK_LINK);
njk.addGlobal("SERVICE_NAME", 'accounts-filing-web');
njk.addGlobal("PIWIK_URL", env.PIWIK_URL);
njk.addGlobal("PIWIK_SITE_ID", env.PIWIK_SITE_ID);
njk.addGlobal("PIWIK_START_GOAL_ID", env.PIWIK_START_GOAL_ID);
njk.addGlobal("servicePath", servicePathPrefix);
njk.addGlobal("submitValidationUrl", env.SUBMIT_VALIDATION_URL);

njk.addFilter("formatDate", formatToUKString);
njk.addFilter("formatProfileType", formatType);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// apply middleware
app.use(cookieParser());

routerDispatch(app);

logger.info("accounts filing Web has started");

process.on("uncaughtException", (err: any) => {
    logger.error(`${err.name} - uncaughtException: ${err.message} - ${err.stack}`);
});

process.on("unhandledRejection", (err: any) => {
    logger.error(`${err.name} - unhandledRejection: ${err.message} - ${err.stack}`);
});

export default app;
