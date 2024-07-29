import { Request, Response } from "express";
import { BaseViewData, GenericHandler, ViewModel } from "./../generic";
import { logger } from "../../../utils/logger";
import { fees } from "../../../utils/constants/fees";
import { getLocalesField } from "../../../utils/localise";

export class HomeHandler extends GenericHandler {

    constructor (req: Request) {
        super({
            title: getLocalesField("start_page_title", req),
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
