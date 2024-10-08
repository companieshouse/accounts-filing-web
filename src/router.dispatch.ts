// Do Router dispatch here, i.e. map incoming routes to appropriate router
import { Application, Router } from "express";
import { servicePathPrefix, Urls } from "./utils/constants/urls";
import { HomeRouter, HealthCheckRouter, FileUpladedRouter, UploadRouter, CompanySearchRouter,
    CompanyConfirmRouter, CheckYourAnswersRouter, ConfirmationSubmissionRouter, BeforeYouFilePackageAccountsRouter,
    ChooseYourPackageAccountsRouter, PaymentCallbackRouter } from "./routers";

import { errorHandler, pageNotFound } from "./routers/handlers/errors";
import { authenticationMiddleware } from "./middleware/authentication.middleware";
import { commonTemplateVariablesMiddleware } from "./middleware/common.variables.middleware";
import { sessionMiddleware } from "./middleware/session.middleware";
import { companyAuthenticationMiddleware } from "./middleware/company.authentication.middleware";
import { localeMiddleware } from "./middleware/locale.middleware";
import { LocalesMiddleware } from "@companieshouse/ch-node-utils";
import { featureFlagMiddleware } from "./middleware/feature.flag.middleware";



const routerDispatch = (app: Application) => {
    // Use a sub-router to place all routes on a path-prefix
    const router = Router();
    // Routes that do not require auth or session are added to the router before the session and auth middlewares
    router.use(Urls.HEALTHCHECK, HealthCheckRouter);
    router.use(featureFlagMiddleware);
    router.use(localeMiddleware);
    router.use(Urls.HOME, HomeRouter);
    router.use(Urls.BEFORE_YOU_FILE_PACKAGE_ACCOUNTS, BeforeYouFilePackageAccountsRouter);

    // ------------- Enable login redirect -----------------
    const userAuthRegex = new RegExp("^/.+");
    router.use(userAuthRegex, sessionMiddleware);
    router.use(userAuthRegex, authenticationMiddleware);
    router.use(Urls.CONFIRM_COMPANY, CompanyConfirmRouter);
    router.use(Urls.COMPANY_SEARCH, CompanySearchRouter);
    router.use(Urls.CHOOSE_YOUR_ACCOUNTS_PACKAGE, companyAuthenticationMiddleware, ChooseYourPackageAccountsRouter);
    router.use(Urls.UPLOAD, companyAuthenticationMiddleware, UploadRouter);
    router.use(Urls.UPLOADED, companyAuthenticationMiddleware, FileUpladedRouter);
    router.use(Urls.CHECK_YOUR_ANSWERS, companyAuthenticationMiddleware, CheckYourAnswersRouter);
    router.use(Urls.CONFIRMATION, companyAuthenticationMiddleware, ConfirmationSubmissionRouter);
    router.use(Urls.PAYMENT_CALLBACK, PaymentCallbackRouter);

    app.use(LocalesMiddleware());
    app.use(servicePathPrefix, router);
    app.use(commonTemplateVariablesMiddleware);
    app.use(errorHandler);
    app.use("*", pageNotFound);
};

export default routerDispatch;
