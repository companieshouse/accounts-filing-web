import { COMPANY_LOOKUP, PrefixedUrls } from "../../../../utils/constants/urls";
import { logger } from "../../../../utils/logger";
import { BaseViewData, GenericHandler, ViewModel } from "../../generic";
import { Request, Response } from "express";
import { CompanyProfileService } from "../../../../services/external/company.profile.service";
import { ValidateCompanyNumberFormat } from "../../../../utils/validate/validate.company.number";
import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile";
import { formatPostCompanyAuthUrl } from "../../../../utils/format/format";

export class CompanyConfirmHandler extends GenericHandler {
    static routeViews: string = "router_views/company/confirm/confirm";

    constructor(private companyProfileService: CompanyProfileService) {
        super({
            title: "Confirm company – Accounts Filing – GOV.UK ",
            backURL: `${PrefixedUrls.COMPANY_SEARCH}/`
        });
    }

    async execute(req: Request, _res: Response): Promise<ViewModel<ConfirmCompanyViewData>> {


        const companyNumber = req.query?.companyNumber as string;

        if (!ValidateCompanyNumberFormat.isValid(companyNumber)){
            this.logInvalidCompanyNumber(companyNumber);
            throw new Error("Company number is invalid");
        }

        const companyProfile: CompanyProfile = await this.companyProfileService.getCompanyProfile(companyNumber);

        const confirmCompanyLink = formatPostCompanyAuthUrl(PrefixedUrls.UPLOAD, companyNumber);

        logger.info(`Serving company profile data`);
        return { templatePath: `${CompanyConfirmHandler.routeViews}`, viewData: { ...this.baseViewData, companyProfile: companyProfile, uploadLink: confirmCompanyLink, changeCompanyUrl: COMPANY_LOOKUP } };
    }


    private logInvalidCompanyNumber(companyNumber: string) {
        if (companyNumber) {
            const invalidCompanyNumber = encodeURIComponent(companyNumber.substring(0, 7));
            logger.error(`An invalid company number entered. Total length of input: ${companyNumber.length}. First 8 encoded characters: ${invalidCompanyNumber}.`);
        } else {
            logger.error('An invalid company number entered of null or undefined.');
        }
    }
}

interface ConfirmCompanyViewData extends BaseViewData {
    companyProfile: CompanyProfile,
    uploadLink: string,
    changeCompanyUrl: string
}
