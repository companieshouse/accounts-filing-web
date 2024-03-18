import { COMPANY_AUTH_UPLOAD, COMPANY_LOOKUP, PrefixedUrls, servicePathPrefix } from "../../../../utils/constants/urls";
import { logger } from "../../../../utils/logger";
import { BaseViewData, GenericHandler, ViewModel } from "../../generic";
import { Request, Response } from "express";
import { CompanyProfileService } from "../../../../services/external/company.profile.service";
import { AccountsFilingCompanyProfile } from "../../../../types/confirm.company.data";
import { ValidateCompanyNumber } from "../../../../utils/validate/validate.company.number";

export class CompanyConfirmHandler extends GenericHandler {
    static routeViews: string = "router_views/company/confirm/confirm";

    constructor(private companyProfileService: CompanyProfileService) {
        super({
            title: "Confirm company – Accounts Filing – GOV.UK ",
            backURL: `${PrefixedUrls.COMPANY_SEARCH}/`
        });
    }

    async execute(req: Request, _res: Response): Promise<ViewModel<CompanyFilingIdData>> {


        const companyNumber = req.query?.companyNumber as string;

        if (!companyNumber) {
            throw new Error("Company number not set");
        }

        if (!ValidateCompanyNumber.isValid(companyNumber)){
            throw new Error("Company number is invalid");
        }

        const companyProfile: AccountsFilingCompanyProfile = await this.companyProfileService.getCompanyProfile(companyNumber);

        const confirmCompanyLink = PrefixedUrls.COMPANY_AUTH_UPLOAD.replace(":companyNumber", companyNumber);

        logger.info(`Serving company profile data`);
        return { templatePath: `${CompanyConfirmHandler.routeViews}`, viewData: { ...this.baseViewData, companyProfile: companyProfile, uploadLink: confirmCompanyLink, changeCompanyUrl: COMPANY_LOOKUP } };
    }

}

interface CompanyFilingIdData extends BaseViewData {
    companyProfile: AccountsFilingCompanyProfile,
    uploadLink: string,
    changeCompanyUrl: string
}
