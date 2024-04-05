import { Request, Response } from "express";
import { BaseViewData, GenericHandler, ViewModel } from "./../generic";
import { logger } from "../../../utils/logger";
import { env } from "../../../config";

export class HomeHandler extends GenericHandler {

    constructor () {
        super({
            title: "File package accounts with Companies House",
            backURL: null
        });
    }

    execute (_req: Request, _res: Response): ViewModel<HomeViewData> {
        const routeViews = "router_views/index";
        logger.info(`GET request for to serve home page`);

        // Fees to be displayed on home for filings
        const fees = {
            CIC: env.CIC_FEE,
            OC: env.OVERSEAS_FEE
        };

        return { templatePath: `${routeViews}/home`, viewData: { ...this.baseViewData, fees: fees } };
    }
}

interface HomeViewData extends BaseViewData {
    fees: {
        CIC: string,
        OC: string
    }
}
