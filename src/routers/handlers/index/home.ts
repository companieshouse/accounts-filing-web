import { Request, Response } from "express";
import { GenericHandler } from "./../generic";
import { logger } from "../../../utils/logger";
import { servicePathPrefix, submitUrl } from "../../../utils/constants/urls";

export class HomeHandler extends GenericHandler {

    constructor () {
        super();
        this.viewData.title = "Home handler for index router";
        this.viewData.sampleKey = "sample value for home page screen";
    }

    execute (_req: Request, res: Response): void {
        const submitLink: string = `${servicePathPrefix}${submitUrl}/`;
        const routeViews = "router_views/index";
        logger.info(`GET request for to serve home page`);
        res.render(`${routeViews}/home`, { ...this.viewData, submitLink });
    }
}
