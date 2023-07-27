import express from "express";
import * as nunjucks from "nunjucks";
import * as path from "path";
import { router } from "./routes/routes";
import { logger } from "./utils/logger";
import { pageNotFound, errorHandler } from "./controllers/error.controller";
import * as urls from "./types/page.urls";
import cookieParser from "cookie-parser";
import { authenticationMiddleware } from "./middleware/authentication.middleware";
import { companyAuthenticationMiddleware } from "./middleware/company.authentication.middleware";
import { commonTemplateVariablesMiddleware } from "./middleware/common.variables.middleware";

const app = express();
app.disable("x-powered-by");

// view engine setup
const nunjucksEnv = nunjucks.configure([
    "views",
    "node_modules/govuk-frontend/",
    "node_modules/govuk-frontend/components/",
  ], {
    autoescape: true,
    express: app,
  });

nunjucksEnv.addGlobal("assetPath", process.env.CDN_HOST);
nunjucksEnv.addGlobal("PIWIK_URL", process.env.PIWIK_URL);
nunjucksEnv.addGlobal("PIWIK_SITE_ID", process.env.PIWIK_SITE_ID);
nunjucksEnv.addGlobal("SERVICE_NAME", process.env.SERVICE_NAME);

app.enable("trust proxy");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "html");

// apply middleware
app.use(cookieParser());

// ------------- Enable login redirect -----------------
const userAuthRegex = new RegExp("^" + urls.ACCOUNTS_FILING + "/.+");
app.use(userAuthRegex, authenticationMiddleware);
app.use(`${urls.ACCOUNTS_FILING}${urls.COMPANY_AUTH_PROTECTED_BASE}`, companyAuthenticationMiddleware);

app.use(commonTemplateVariablesMiddleware)
// apply our default router to /accounts-filing
app.use(urls.ACCOUNTS_FILING, router);
app.use(errorHandler, pageNotFound);

logger.info("accounts filing Web has started");

export default app;