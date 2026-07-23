import { COMPANY_LOOKUP, PrefixedUrls } from "../../../../utils/constants/urls";
import { logger } from "../../../../utils/logger";
import { LocalizedViewData, GenericHandler, ViewModel } from "../../generic";
import { Request, Response } from "express";
import { CompanyProfileService } from "../../../../services/external/company.profile.service";
import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile";
import { checkCompanyNumberFormatIsValidate as companyNumberMustBeValid } from "../../../../utils/format/company.number.format";
import { getUserEmail, must, setCompanyName, setExtraDataCompanyNumber, setLanguage } from "../../../../utils/session";
import { addLangToUrl, addEncodeURILangToUrl, selectLang, getLocalesField } from "../../../../utils/localise";


interface ConfirmCompanyViewData extends LocalizedViewData {
    companyProfile: CompanyProfile,
    changeCompanyUrl: string
}

export class CompanyConfirmHandler extends GenericHandler {
    static routeViews: string = "router_views/company/confirm/confirm";

    constructor(private companyProfileService: CompanyProfileService) {
        super({
            viewName: "confirm",
            backURL: null,
            userEmail: null
        });
    }

    async execute(req: Request, _res: Response): Promise<ViewModel<ConfirmCompanyViewData>> {
        const language = selectLang(req.query.lang);
        const companyNumber = req.query?.companyNumber as string;

        companyNumberMustBeValid(companyNumber);
        // Set company number for the life of the session.
        setExtraDataCompanyNumber(req.session, companyNumber);

        const companyProfile: CompanyProfile = await this.companyProfileService.getCompanyProfile(companyNumber);

        setCompanyName(req.session, companyProfile.companyName);
        setLanguage(req.session, language);

        const userEmail = must(getUserEmail(req.session));

        this.populateViewData(req);
        this.baseViewData.backURL = addLangToUrl(PrefixedUrls.COMPANY_SEARCH, language);
        this.baseViewData.nextURL = addLangToUrl(PrefixedUrls.CHOOSE_YOUR_ACCOUNTS_PACKAGE, language);
        this.baseViewData.userEmail = userEmail;
        logger.info(`Serving company profile data`);
        return { templatePath: `${CompanyConfirmHandler.routeViews}`,
            viewData: {
                ...this.baseViewData,
                title: getLocalesField("confirm_company_title", req),
                companyProfile: companyProfile,
                changeCompanyUrl: addEncodeURILangToUrl(COMPANY_LOOKUP, language)
            }
        };
    }

}
