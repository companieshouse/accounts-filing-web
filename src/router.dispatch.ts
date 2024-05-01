// Do Router dispatch here, i.e. map incoming routes to appropriate router
import { Application, Router } from "express";
import { servicePathPrefix, Urls } from "./utils/constants/urls";
import { HomeRouter, HealthCheckRouter, FileUpladedRouter, UploadRouter, CompanySearchRouter, CompanyConfirmRouter, CheckYourAnswersRouter, ConfirmationSubmissionRouter, BeforeYouFilePackageAccountsRouter } from "./routers";

import { errorHandler, pageNotFound } from "./routers/handlers/errors";
import { authenticationMiddleware } from "./middleware/authentication.middleware";
import { commonTemplateVariablesMiddleware } from "./middleware/common.variables.middleware";
import { sessionMiddleware } from "./middleware/session.middleware";
import { companyAuthenticationMiddleware } from "./middleware/company.authentication.middleware";

const routerDispatch = (app: Application) => {
    // Use a sub-router to place all routes on a path-prefix
    const router = Router();

    // Routes that do not require auth or session are added to the router before the session and auth middlewares
    router.use(Urls.HOME, HomeRouter);
    router.use(Urls.HEALTHCHECK, HealthCheckRouter);
    router.use(Urls.BEFORE_YOU_FILE_PACKAGE_ACCOUNTS, BeforeYouFilePackageAccountsRouter);

    // ------------- Enable login redirect -----------------
    const userAuthRegex = new RegExp("^/.+");
    router.use(userAuthRegex, sessionMiddleware);
    router.use(userAuthRegex, authenticationMiddleware);
    router.use(Urls.CONFIRM_COMPANY, CompanyConfirmRouter);
    router.use(Urls.COMPANY_SEARCH, CompanySearchRouter);

    router.use(Urls.UPLOAD, companyAuthenticationMiddleware, UploadRouter);
    router.use(Urls.UPLOADED, FileUpladedRouter);
    router.use(Urls.CHECK_YOUR_ANSWERS, CheckYourAnswersRouter);
    router.use(Urls.CONFIRMATION, ConfirmationSubmissionRouter);

    app.use(servicePathPrefix, router);
    app.use(commonTemplateVariablesMiddleware);
    app.use(errorHandler);
    app.use("*", pageNotFound);
};

export default routerDispatch;
