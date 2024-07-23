import { Request, Response } from "express";
import { BaseViewData, GenericHandler, ViewModel } from "./../generic";
import { logger } from "../../../utils/logger";
import { fees } from "../../../utils/constants/fees";

export class HomeHandler extends GenericHandler {

    constructor () {
        super({
            title: "File package accounts with Companies House",
            viewName: "home",
            backURL: null
        });
    }

    execute (_req: Request, _res: Response): ViewModel<HomeViewData> {
        const routeViews = "router_views/index";
        logger.info(`GET request for to serve home page`);


        return { templatePath: `${routeViews}/home`, viewData: { ...this.baseViewData, fees } };
    }
}

interface HomeViewData extends BaseViewData {
    fees: typeof fees
}
