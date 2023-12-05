import { Request, Response, Router, NextFunction } from "express";
import { HomeHandler } from "./handlers/index/home";

const router: Router = Router();

router.get("/", async (req: Request, res: Response, _next: NextFunction) => {
    const handler = new HomeHandler();
    await handler.execute(req, res);
});

export default router;
