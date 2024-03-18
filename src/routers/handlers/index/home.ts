import { Request, Response } from "express";
import { BaseViewData, GenericHandler, ViewModel } from "./../generic";
import { logger } from "../../../utils/logger";

export class HomeHandler extends GenericHandler {

    constructor () {
        super({
            title: "Home handler for index router",
            backURL: null
        });
    }

    execute (_req: Request, _res: Response): ViewModel<BaseViewData> {
        const routeViews = "router_views/index";
        logger.info(`GET request for to serve home page`);
        return { templatePath: `${routeViews}/home`, viewData: { ...this.baseViewData } };
    }
}

