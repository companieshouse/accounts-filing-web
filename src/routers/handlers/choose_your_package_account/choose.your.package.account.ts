import { PrefixedUrls } from "../../../utils/constants/urls";
import { getCompanyNumber, getPackageType, setPackageType } from "../../../utils/session";
import { BaseViewData, GenericHandler } from "../generic";
import { Request, Response } from "express";
import { PackageAccountType, getPackageItems, PackageAccounts } from "../../../utils/constants/packageAccounts";
import { logger } from "../../../utils/logger";
import { PackageType } from "@companieshouse/api-sdk-node/dist/services/accounts-filing/types";

interface ChooseYourPackageAccountViewData extends BaseViewData {
    packageAccountItems: Array<PackageAccountType>
    packageAccount?: PackageType
}

export class ChooseYourPackageAccountHandler extends GenericHandler {
    private packageAccountItems = getPackageItems();
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
        const packageAccount = req.body;

        if ("value" in packageAccount && packageAccount["value"] in PackageAccounts){
            setPackageType(req.session, packageAccount);
        } else {
            this.baseViewData.errors.packageAccount = new Error("Package Account type must be set");
        }

        this.baseViewData.backURL = `${PrefixedUrls.CONFIRM_COMPANY}?companyNumber=${companyNumber}`;

        return {
            ...this.baseViewData,
            packageAccountItems: this.packageAccountItems
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
            packageAccountItems: this.packageAccountItems
        };
    }
}
