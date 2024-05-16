import { PrefixedUrls, Urls } from "../../../utils/constants/urls";
import { getCompanyNumber, setPackageType } from "../../../utils/session";
import { BaseViewData, GenericHandler } from "../generic";
import { Request, Response } from "express";
import { PackageAccountsType, getPackageItems, PackageTypeDetails } from "../../../utils/constants/PackageTypeDetails";
import { logger } from "../../../utils/logger";
import { PackageType } from "@companieshouse/api-sdk-node/dist/services/accounts-filing/types";

interface ChooseYourPackageAccountsViewData extends BaseViewData {
    packageAccountsItems: Array<PackageAccountsType>,
    packageAccounts?: PackageType,
    template: string
}

export class ChooseYourPackageAccountsHandler extends GenericHandler {
    private static template: string = "router_views/choose_your_package_accounts/choose_your_package_accounts";
    private packageAccountsItems = getPackageItems();
    constructor() {
        super({
            title: "What package accounts are you submitting?",
            backURL: null
        });
    }

    async executePost (
        req: Request,
        _response: Response
    ): Promise<string | {redirect: string}> {
        logger.info(`post request made for ${this.constructor.name}`);
        super.populateViewData(req);
        const packageTypeChoice = (Object.assign({}, req.body)).PackageAccounts;

        if (packageTypeChoice in PackageTypeDetails){
            setPackageType(req.session, packageTypeChoice);
            return { redirect: PrefixedUrls.UPLOAD };
        } else {
            return ChooseYourPackageAccountsHandler.template;
        }
    }

    async executeGet(
        req: Request,
        _response: Response
    ): Promise<ChooseYourPackageAccountsViewData>{
        logger.info(`get request made for ${this.constructor.name}`);
        super.populateViewData(req);
        const companyNumber = getCompanyNumber(req.session);

        this.baseViewData.backURL = `${Urls.CONFIRM_COMPANY}?companyNumber=${companyNumber}`;

        return {
            ...this.baseViewData,
            packageAccountsItems: this.packageAccountsItems,
            template: ChooseYourPackageAccountsHandler.template
        };
    }
}
