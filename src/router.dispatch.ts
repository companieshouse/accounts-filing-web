// Do Router dispatch here, i.e. map incoming routes to appropriate router
import { Application, Request, Response, Router } from "express";
import { servicePathPrefix } from "./lib/constants";
import HomeRouter from "./routers/indexRouter";

const routerDispatch = (app: Application) => {
    // Use a sub-router to place all routes on a path-prefix
    const router = Router();
    app.use(servicePathPrefix, router);

    router.use("/", HomeRouter);

    router.use("*", (req: Request, res: Response) => {
        res.status(404).render("partials/error_400");
    });
};

export default routerDispatch;
