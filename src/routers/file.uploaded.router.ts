import { Request, Response, Router, NextFunction } from "express";
import { UploadedHandler } from "./handlers/uploaded/uploaded";
import { logger } from "../utils/logger";
import { AccountsFilingService } from "../services/external/accounts.filing.service";
import { handleExceptions } from "../utils/error.handler";

const router: Router = Router();

/**
 * Route handler for the root path of the router.
 * Responds with a 400 Bad Request status if called, indicating that a UUIDv4 file ID is required.
 *
 * @param {Request} _req - The incoming request object (unused in this method).
 * @param {Response} res - The response object used to send the response.
 * @param {NextFunction} _next - The next middleware function in the Express router (unused in this method).
 */
router.get("/", (_req: Request, res: Response, _next: NextFunction) => {
    res.status(400).send("Bad Request. Request to file uploaded callback needs a UUIDv4 fileId");
});

/**
 * Route handler for getting the uploaded file data.
 * This handler is triggered for a GET request with a specific fileId.
 * It creates an instance of UploadedHandler, executes it to process the request,
 * and then renders the view with the returned data.
 *
 * @param {Request} req - The incoming request object, containing the fileId and other request data.
 * @param {Response} res - The response object used to send the response.
 * @param {NextFunction} _next - The next middleware function in the Express router (unused in this method).
 */
router.get("/:fileId", handleExceptions(async (req: Request, res: Response, _next: NextFunction) => {

    logger.debug("Uploaded endpoint triggered.");
    const handler = new UploadedHandler(new AccountsFilingService(req.session!));
    const viewData = await handler.executeGet(req, res);

    logger.debug(`Uploaded view data: ${JSON.stringify(viewData, null, 2)}`);

    res.render(`router_views/uploaded/uploaded.njk`, viewData);
}));

export default router;
