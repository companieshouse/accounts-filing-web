// Do Router dispatch here, i.e. map incoming routes to appropriate router
import { Application, Router } from "express";
import { servicePathPrefix, Urls } from "./utils/constants/urls";
import { HomeRouter, HealthCheckRouter, FileUpladedRouter, UploadRouter, CompanySearchRouter,
    CompanyConfirmRouter, CheckYourAnswersRouter, ConfirmationSubmissionRouter, BeforeYouFilePackageAccountsRouter,
    ChooseYourPackageAccountsRouter, PaymentCallbackRouter } from "./routers";

import { errorHandler, pageNotFound } from "./routers/handlers/errors";
import { authenticationMiddleware } from "./middleware/authentication.middleware";
import { commonTemplateVariablesMiddleware } from "./middleware/common.variables.middleware";
import { COOKIE_CONFIG, sessionMiddleware } from "./middleware/session.middleware";
import { companyAuthenticationMiddleware } from "./middleware/company.authentication.middleware";
import { localeMiddleware } from "./middleware/locale.middleware";
import { LocalesMiddleware } from "@companieshouse/ch-node-utils";
import { featureFlagMiddleware } from "./middleware/feature.flag.middleware";
import Redis from "ioredis";
import { env } from "./config";
import { EnsureSessionCookiePresentMiddleware, SessionStore } from "@companieshouse/node-session-handler";
import { v4 as uuidv4 } from "uuid";
import { assignCspNonce } from "./middleware/csp.nonce.middleware";
import { CsrfProtectionMiddleware } from "@companieshouse/web-security-node";
import { prepareCSPConfig } from "./middleware/content.policy.middleware";
import helmet from "helmet";
import { csrfErrorHandler } from "./routers/handlers/errors/csrf.error";
import { createLoggerMiddleware } from "@companieshouse/structured-logging-node";



const routerDispatch = (app: Application) => {
    // Use a sub-router to place all routes on a path-prefix
    const router = Router();
    const sessionStore = setupSessionStore();
    const csrfMiddlewareOptions = setupCSRFOptions(sessionStore);
    // Assign the nonce value to be accessible within views
    const nonce = uuidv4();
    app.use(assignCspNonce(nonce));
    // Routes that do not require auth or session are added to the router before the session and auth middlewares
    router.use(Urls.HEALTHCHECK, HealthCheckRouter);
    router.use(featureFlagMiddleware);
    router.use(localeMiddleware);
    router.use(createLoggerMiddleware(env.APP_NAME));
    router.use(Urls.HOME, HomeRouter);
    router.use(Urls.HOME_WITH_COMPANY_NUMBER, HomeRouter);
    router.use(Urls.BEFORE_YOU_FILE_PACKAGE_ACCOUNTS, BeforeYouFilePackageAccountsRouter);

    // ------------- Enable login redirect -----------------
    const userAuthRegex = new RegExp("^/.+");
    router.use(userAuthRegex, sessionMiddleware(sessionStore));
    router.use(Urls.BEFORE_YOU_FILE_PACKAGE_ACCOUNTS_WITH_COMPANY_NUMBER, BeforeYouFilePackageAccountsRouter);
    // It is important that CSRF Protection follows the Session and urlencoded Middlewares
    router.use(CsrfProtectionMiddleware(csrfMiddlewareOptions));
    router.use(helmet(prepareCSPConfig(nonce)));

    router.use(EnsureSessionCookiePresentMiddleware(COOKIE_CONFIG));
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
    errorPageHandlers(app);
};

const setupSessionStore = () => {
    const redis = new Redis(`redis://${env.CACHE_SERVER}`);
    return new SessionStore(redis);
};

const setupCSRFOptions = (sessionStore: SessionStore) => {
    return {
        sessionStore,
        enabled: true,
        sessionCookieName: env.COOKIE_NAME
    };
};

const errorPageHandlers = (app: Application) => {
    app.use(csrfErrorHandler);
    app.use(errorHandler);
    app.use("*", pageNotFound);
};

export default routerDispatch;
