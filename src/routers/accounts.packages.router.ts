import { Request, Response, Router, NextFunction } from "express"
import { AccountPackages } from "./handlers/packages/packagesHandler"
import { ACCOUNTS_PACKAGES_URL } from "../utils/constants/urls"

const router: Router = Router()
const routeViews: string = `router_views/packages`

router.get(ACCOUNTS_PACKAGES_URL, async (req: Request, res: Response, _next: NextFunction) => {
    const handler = new AccountPackages()
    const viewData = await handler.execute(req, res)
    res.render(`${routeViews}/packages`, viewData)
})

export default router