import { Request, Response, Router, NextFunction } from "express";
import { HomeHandler } from "./handlers/index/home";

const router: Router = Router();

router.get("/",  (req: Request, res: Response, _next: NextFunction) => {
    const handler = new HomeHandler();
    const params = handler.execute(req, res);
    res.render(params.link, params.data);
});

export default router;
