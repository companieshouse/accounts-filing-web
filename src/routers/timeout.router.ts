import { Request, Response, Router, NextFunction } from "express";
import { handleExceptions } from "../utils/error.handler";
import { TimeoutHandler } from "./handlers/timeout/timeout";

const router: Router = Router();

router.get('/', handleExceptions(async (req: Request, res: Response, _next: NextFunction) => {
    const handler = new TimeoutHandler(req);
    const params = handler.execute(req, res);
    if (params.templatePath && params.viewData) {
        res.render(params.templatePath, params.viewData);
    }
}));

export default router;
