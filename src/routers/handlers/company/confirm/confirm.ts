import { COMPANY_LOOKUP, PrefixedUrls, URL_QUERY_PARAM } from "../../../../utils/constants/urls";
import { logger } from "../../../../utils/logger";
import { BaseViewData, GenericHandler, ViewModel } from "../../generic";
import { Request, Response } from "express";
import { CompanyProfileService } from "../../../../services/external/company.profile.service";
import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile";
import { checkCompanyNumberFormatIsValidate as companyNumberMustBeValid } from "../../../../utils/format/company.number.format";
import { setCompanyName } from "../../../../utils/session";

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

        companyNumberMustBeValid(companyNumber);

        const companyProfile: CompanyProfile = await this.companyProfileService.getCompanyProfile(companyNumber);

        const confirmCompanyLink = `${PrefixedUrls.UPLOAD}/?${URL_QUERY_PARAM.PARAM_COMPANY_NUMBER}=${companyNumber}`;

        setCompanyName(req.session, companyProfile.companyName);

        logger.info(`Serving company profile data`);
        return { templatePath: `${CompanyConfirmHandler.routeViews}`, viewData: { ...this.baseViewData, companyProfile: companyProfile, uploadLink: confirmCompanyLink, changeCompanyUrl: COMPANY_LOOKUP } };
    }

}

interface ConfirmCompanyViewData extends BaseViewData {
    companyProfile: CompanyProfile,
    uploadLink: string,
    changeCompanyUrl: string
}
