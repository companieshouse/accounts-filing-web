import { PrefixedUrls } from "../../../utils/constants/urls";
import { getCompanyNumber, setPackageType } from "../../../utils/session";
import { BaseViewData, GenericHandler } from "../generic";
import { Request, Response } from "express";
import { PackageAccountType, getPackageItems, PackageAccounts } from "../../../utils/constants/PackageTypeDetails";
import { logger } from "../../../utils/logger";
import { PackageType } from "@companieshouse/api-sdk-node/dist/services/accounts-filing/types";

interface ChooseYourPackageAccountViewData extends BaseViewData {
    packageAccountsItems: Array<PackageAccountType>
    packageAccounts?: PackageType
}

export class ChooseYourPackageAccountHandler extends GenericHandler {
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
    ): Promise<ChooseYourPackageAccountViewData> {
        logger.info(`post request made for ${this.constructor.name}`);
        super.populateViewData(req);
        const companyNumber = getCompanyNumber(req.session);
        const packageAccounts = req.body;

        if ("value" in packageAccounts && packageAccounts["value"] in PackageAccounts){
            setPackageType(req.session, packageAccounts);
        } else {
            this.baseViewData.errors.packageAccountsError = new Error("Package Accounts type must be set");
        }

        this.baseViewData.backURL = `${PrefixedUrls.CONFIRM_COMPANY}?companyNumber=${companyNumber}`;

        return {
            ...this.baseViewData,
            packageAccountsItems: this.packageAccountsItems
        };
    }

    async executeGet(
        req: Request,
        _response: Response
    ): Promise<ChooseYourPackageAccountViewData>{
        logger.info(`get request made for ${this.constructor.name}`);
        super.populateViewData(req);
        const companyNumber = getCompanyNumber(req.session);

        this.baseViewData.backURL = `${PrefixedUrls.CONFIRM_COMPANY}?companyNumber=${companyNumber}`;

        return {
            ...this.baseViewData,
            packageAccountsItems: this.packageAccountsItems
        };
    }
}
