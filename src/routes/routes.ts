import { Request, Response, Router } from "express";
import * as startRoute from "../controllers/start.controller";

export const router: Router = Router();

/**
 * Simply renders a view template.
 *
 * @param template the template name
 */
const renderTemplate = (template: string) => (req: Request, res: Response) => {
    return res.render(template);
  };

  router.get("/", startRoute.get);