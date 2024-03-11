import { Request, Response } from "express";
import { BaseViewData, GenericHandler, ViewModel } from "./../generic";
import { logger } from "../../../utils/logger";
import { servicePathPrefix, COMPANY_SEARCH } from "../../../utils/constants/urls";

export class HomeHandler extends GenericHandler {

    constructor () {
        super({
            title: "Home handler for index router",
            backURL: null
        });
    }

    execute (_req: Request, _res: Response): ViewModel<HomeViewData> {
        const searchLink: string = `${servicePathPrefix}${COMPANY_SEARCH}/`;
        const routeViews = "router_views/index";
        logger.info(`GET request for to serve home page`);
        return { templatePath: `${routeViews}/home`, viewData: { ...this.baseViewData, searchLink: searchLink } };
    }
}

interface HomeViewData extends BaseViewData {
    searchLink: string
}
