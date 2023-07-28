// Do Router dispatch here, i.e. map incoming routes to appropriate router
import { Application, Router, Request } from "express";
import { servicePathPrefix, COMPANY_AUTH_PROTECTED_BASE, healthcheckUrl } from "./utils/constants/urls";
import { HomeRouter, HealthCheckRouter } from "./routers";
import { errorHandler, pageNotFound } from "./routers/handlers/errors";
import { authenticationMiddleware } from "./middleware/authentication.middleware";
import { commonTemplateVariablesMiddleware } from "./middleware/common.variables.middleware";
import { companyAuthenticationMiddleware } from "./middleware/company.authentication.middleware";
import { getRelativeUrl, skipIf } from "./utils";

const routerDispatch = (app: Application) => {
    // Use a sub-router to place all routes on a path-prefix
    const router = Router();
    app.use(servicePathPrefix, router);

    // ------------- Enable login redirect -----------------
    const userAuthRegex = new RegExp("^/.+");
    const isHealthCheckEndpoint = (req: Request) => getRelativeUrl(req).startsWith(healthcheckUrl);
    router.use(userAuthRegex, skipIf(isHealthCheckEndpoint, authenticationMiddleware));
    router.use(`${COMPANY_AUTH_PROTECTED_BASE}`, companyAuthenticationMiddleware);

    router.use("/", HomeRouter);
    router.use(healthcheckUrl, HealthCheckRouter);

    app.use(commonTemplateVariablesMiddleware);
    app.use(errorHandler);
    app.use("*", pageNotFound);
};



export default routerDispatch;
