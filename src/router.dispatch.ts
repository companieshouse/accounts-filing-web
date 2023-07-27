// Do Router dispatch here, i.e. map incoming routes to appropriate router
import { Application, Router } from "express";
import { servicePathPrefix, COMPANY_AUTH_PROTECTED_BASE } from "./utils/constants/urls";
import HomeRouter from "./routers/index.router";
import { errorHandler, pageNotFound } from "./routers/handlers/errors";
import { authenticationMiddleware } from "./middleware/authentication.middleware";
import { commonTemplateVariablesMiddleware } from "./middleware/common.variables.middleware";
import { companyAuthenticationMiddleware } from "./middleware/company.authentication.middleware";

const routerDispatch = (app: Application) => {
    // Use a sub-router to place all routes on a path-prefix
    const router = Router();
    app.use(servicePathPrefix, router);

    // ------------- Enable login redirect -----------------
    const userAuthRegex = new RegExp("^/.+");
    router.use(userAuthRegex, authenticationMiddleware);
    router.use(`${COMPANY_AUTH_PROTECTED_BASE}`, companyAuthenticationMiddleware);

    app.use(commonTemplateVariablesMiddleware);


    router.use("/", HomeRouter);

    app.use(errorHandler);
    app.use("*", pageNotFound);
};

export default routerDispatch;
