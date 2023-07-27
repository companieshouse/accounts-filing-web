import express from "express";
import * as nunjucks from "nunjucks";
import * as path from "path";
import { logger } from "./utils/logger";
import cookieParser from "cookie-parser";
import routerDispatch from "./router.dispatch";

const app = express();
app.disable("x-powered-by");

app.set("views", [
    path.join(__dirname, "views"),
    path.join(__dirname, "node_modules/govuk-frontend"),
    path.join(__dirname, "../node_modules/govuk-frontend"), // This if for when using ts-node since the working directory is src
    path.join(__dirname, "node_modules/govuk-frontend/components")
]);

const nunjucksLoaderOpts = {
    watch: process.env.NUNJUCKS_LOADER_WATCH !== "false",
    noCache: process.env.NUNJUCKS_LOADER_NO_CACHE !== "true"
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

njk.addGlobal("cdnUrlCss", process.env.CDN_URL_CSS);
njk.addGlobal("cdnUrlJs", process.env.CDN_URL_JS);
njk.addGlobal("cdnHost", process.env.CDN_HOST);
njk.addGlobal("chsUrl", process.env.CHS_URL);


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// apply middleware
app.use(cookieParser());

routerDispatch(app);

logger.info("accounts filing Web has started");

process.on("uncaughtException", (err: any) => {
    logger.error(`${err.name} - uncaughtException: ${err.message} - ${err.stack}`);
    process.exit(1);
});

process.on("unhandledRejection", (err: any) => {
    logger.error(`${err.name} - unhandledRejection: ${err.message} - ${err.stack}`);
    process.exit(1);
});

export default app;
