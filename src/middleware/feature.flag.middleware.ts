import { logger } from "../utils/logger";
import { env } from "../config";
import { Handler } from "express";

/**
 * Feature flag for presenter account. Default value is true.
 * @param req http request
 * @param res http response
 * @param next the next handler in the chain
 */
export const featureFlagMiddleware: Handler = (_req, res, next) => {

    if (!env.FEATURE_FLAG_ZIP_PORTAL_270924) {
        logger.info("Attempt to reach site while the feature flag is disabled");
        res.render("partials/error_404");
    } else {
        next();
    }
};
