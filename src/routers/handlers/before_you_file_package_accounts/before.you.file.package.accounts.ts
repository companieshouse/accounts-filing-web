import { Request, Response } from "express";
import { BaseViewData, GenericHandler, ViewModel } from "./../generic";
import { logger } from "../../../utils/logger";

export class BeforeYouFilePackageAccountsHandler extends GenericHandler {
    static routeViews: string = "router_views/before_you_file_package_accounts/before_you_file_package_accounts";

    constructor () {
        super({
            title: "Before you file package accounts – File package accounts with Companies House – GOV.UK",
            backURL: null
        });
    }

    execute (_req: Request, _res: Response): ViewModel<BaseViewData> {

        logger.info(`GET request for to serve before you file package accounts page`);
        return { templatePath: `${BeforeYouFilePackageAccountsHandler.routeViews}`, viewData: this.baseViewData };
    }
}
