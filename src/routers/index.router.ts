import { Request, Response, Router, NextFunction } from "express";
import { HomeHandler } from "./handlers/index/home";
import { servicePathPrefix, submitUrl } from "../utils/constants/urls";

const router: Router = Router();
const routeViews = "router_views/index";

router.get("/", async (req: Request, res: Response, _next: NextFunction) => {
    const handler = new HomeHandler();
    const viewData = await handler.execute(req, res);
    const submitLink: string = `${servicePathPrefix}${submitUrl}/`;
    res.render(`${routeViews}/home`, { ...viewData, submitLink });
});

export default router;
