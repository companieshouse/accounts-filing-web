import { Request, Response, Router, NextFunction } from "express";
import { HomeHandler } from "./handlers/index/home";

const router: Router = Router();

router.get("/", async (req: Request, res: Response, _next: NextFunction) => {
    const handler = new HomeHandler();
    const params = await Promise.resolve(handler.execute(req, res));
    const [path, data] = params;
    res.render(path, data);
});

export default router;
