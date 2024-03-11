// Do Router dispatch here, i.e. map incoming routes to appropriate router
import { Application, Router } from "express";
import { servicePathPrefix, COMPANY_AUTH_PROTECTED_BASE, healthcheckUrl, uploadedUrl, submitUrl, Urls } from "./utils/constants/urls";
import { HomeRouter, HealthCheckRouter, FileUpladedRouter, SubmitRouter, CheckYourAnswersRouter } from "./routers";
import { errorHandler, pageNotFound } from "./routers/handlers/errors";
import { authenticationMiddleware } from "./middleware/authentication.middleware";
import { commonTemplateVariablesMiddleware } from "./middleware/common.variables.middleware";
import { companyAuthenticationMiddleware } from "./middleware/company.authentication.middleware";
import { sessionMiddleware } from "./middleware/session.middleware";

const routerDispatch = (app: Application) => {
    // Use a sub-router to place all routes on a path-prefix
    const router = Router();

    // Routes that do not require auth or session are added to the router before the session and auth middlewares
    router.use("/", HomeRouter);
    router.use(healthcheckUrl, HealthCheckRouter);

    // ------------- Enable login redirect -----------------
    const userAuthRegex = new RegExp("^/.+");
    router.use(userAuthRegex, sessionMiddleware);
    router.use(userAuthRegex, authenticationMiddleware);
    router.use(`${COMPANY_AUTH_PROTECTED_BASE}`, companyAuthenticationMiddleware);

    router.use(uploadedUrl, FileUpladedRouter);
    router.use(submitUrl, SubmitRouter);
    router.use(Urls.CHECK_YOUR_ANSWERS, CheckYourAnswersRouter);

    app.use(servicePathPrefix, router);
    app.use(commonTemplateVariablesMiddleware);
    app.use(errorHandler);
    app.use("*", pageNotFound);
};

export default routerDispatch;
