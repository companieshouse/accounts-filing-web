import { COMPANY_AUTH_UPLOAD, COMPANY_LOOKUP, COMPANY_SEARCH, servicePathPrefix } from "../../../../utils/constants/urls";
import { logger } from "../../../../utils/logger";
import { BaseViewData, GenericHandler, ViewModel } from "../../generic";
import { Request, Response } from "express";
import { CompanyProfileService } from "../../../../services/external/company.profile.service";
import { AccountsFilingCompanyProfile } from "../../../../types/confirm.company.data";
import { ValidateCompanyNumber } from "../../../../utils/validate/validate.company.number";

export class CompanyConfirmHandler extends GenericHandler {

    constructor(private companyProfileService: CompanyProfileService) {
        super({
            title: "Confirm company – Accounts Filing – GOV.UK ",
            backURL: `${servicePathPrefix}${COMPANY_SEARCH}/`
        });
    }

    async execute(req: Request, _res: Response): Promise<ViewModel<CompanyFilingIdData>> {

        const routeViews: string = "router_views/company/confirm";
        const companyNumber = req.query?.companyNumber as string;

        if (!companyNumber) {
            throw new Error("Company number not set");
        }

        if (!ValidateCompanyNumber.isValid(companyNumber)){
            throw new Error("Company number is invalid");
        }

        const companyProfile: AccountsFilingCompanyProfile = await this.companyProfileService.getCompanyProfile(companyNumber);

        const confirmCompanyLink: string = `${servicePathPrefix}${COMPANY_AUTH_UPLOAD}`.replace(":companyNumber", companyNumber);

        logger.info(`Serving company profile data`);
        return { templatePath: `${routeViews}/confirm`, viewData: { ...this.baseViewData, companyProfile: companyProfile, uploadLink: confirmCompanyLink, changeCompanyUrl: COMPANY_LOOKUP } };
    }

}

interface CompanyFilingIdData extends BaseViewData {
    companyProfile: AccountsFilingCompanyProfile,
    uploadLink: string,
    changeCompanyUrl: string
}
