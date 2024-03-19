// Do Router dispatch here, i.e. map incoming routes to appropriate router
import { Application, Router } from "express";
import { servicePathPrefix, Urls } from "./utils/constants/urls";
import { HomeRouter, HealthCheckRouter, FileUpladedRouter, UploadRouter, CompanySearchRouter, CompanyConfirmRouter, CheckYourAnswersRouter } from "./routers";


import { errorHandler, pageNotFound } from "./routers/handlers/errors";
import { authenticationMiddleware } from "./middleware/authentication.middleware";
import { commonTemplateVariablesMiddleware } from "./middleware/common.variables.middleware";
import { companyAuthenticationMiddleware } from "./middleware/company.authentication.middleware";
import { sessionMiddleware } from "./middleware/session.middleware";

const routerDispatch = (app: Application) => {
    // Use a sub-router to place all routes on a path-prefix
    const router = Router();

    // Routes that do not require auth or session are added to the router before the session and auth middlewares
    router.use(Urls.HOME, HomeRouter);
    router.use(Urls.HEALTHCHECK, HealthCheckRouter);

    // ------------- Enable login redirect -----------------
    const userAuthRegex = new RegExp("^/.+");
    router.use(userAuthRegex, sessionMiddleware);
    router.use(userAuthRegex, authenticationMiddleware);
    router.use(Urls.CONFIRM_COMPANY, CompanyConfirmRouter);
    router.use(Urls.COMPANY_SEARCH, CompanySearchRouter);

    // Everything post this middleware will be company authenticated
    // Ensures that param value is used before session
    router.use(Urls.COMPANY_AUTH_PROTECTED_BASE, companyAuthenticationMiddleware);
    router.use(userAuthRegex, companyAuthenticationMiddleware);

    router.use(Urls.COMPANY_AUTH_UPLOAD, UploadRouter);
    router.use(Urls.UPLOADED, FileUpladedRouter);
    router.use(Urls.CHECK_YOUR_ANSWERS, CheckYourAnswersRouter);

    app.use(servicePathPrefix, router);
    app.use(commonTemplateVariablesMiddleware);
    app.use(errorHandler);
    app.use("*", pageNotFound);
};

export default routerDispatch;
