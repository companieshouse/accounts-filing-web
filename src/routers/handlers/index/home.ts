import { Request, Response } from "express";
import { BaseViewData, GenericHandler, ViewModel } from "./../generic";
import { logger } from "../../../utils/logger";
import { fees } from "../../../utils/constants/fees";
import { getLocalesField, addLangToUrl, selectLang } from "../../../utils/localise";
import { PrefixedUrls } from "../../../utils/constants/urls";
import { env } from "../../../config";
import { ValidateCompanyNumberFormat } from "../../../utils/validate/validate.company.number";

export class HomeHandler extends GenericHandler {

    constructor(req: Request) {
        super({
            title: getLocalesField("start_page_title", req),
            viewName: "home",
            backURL: null,
            userEmail: null,
        });
    }

    private isChsRouteIn(req: Request) {
        const companyNumber = req.params.companyNumber as string | undefined;
        return companyNumber !== undefined && ValidateCompanyNumberFormat.isValid(companyNumber);
    }

    private determineNextURL(req: Request): string {
        const companyNumber = req.params.companyNumber as string | undefined;
        if (companyNumber && ValidateCompanyNumberFormat.isValid(companyNumber)) {
            return addLangToUrl(
                PrefixedUrls.BEFORE_YOU_FILE_PACKAGE_ACCOUNTS_WITH_COMPANY_NUMBER.replace(":companyNumber", companyNumber),
                selectLang(req.query.lang)
            );
        }
        return addLangToUrl(PrefixedUrls.BEFORE_YOU_FILE_PACKAGE_ACCOUNTS, selectLang(req.query.lang));
    }

    execute(req: Request, _res: Response): ViewModel<HomeViewData> {
        const routeViews = "router_views/index";
        logger.info(`GET request to serve home page`);

        const disablePackageInfo = {
            cic_disabled: env.CIC_DISABLE_RADIO,
            overseas_disabled: env.DISABLE_OVERSEAS_COMPANY_ACCOUNTS_RADIO,
            audit_exempt_disabled: env.DISABLE_AUDIT_EXEMPT_SUBSIDIARY_ACCOUNTS_RADIO,
            dormant_disabled: env.DISABLE_DORMANT_EXEMPT_SUBSIDIARY_ACCOUNTS_RADIO,
            limited_disabled: env.DISABLE_LIMITED_PARTNERSHIP_ACCOUNTS_RADIO,
            group_400_disabled: env.DISABLE_GROUP_SECTION_400_UK_PARENT_ACCOUNTS_RADIO,
            group_401_disabled: env.DISABLE_GROUP_SECTION_401_NON_UK_PARENT_ACCOUNTS_RADIO,
            welsh_disabled: env.DISABLE_WELSH_ACCOUNTS_RADIO
        };

        return {
            templatePath: `${routeViews}/home`,
            viewData: {
                ...this.baseViewData,
                fees,
                ...disablePackageInfo,
                nextURL: this.determineNextURL(req),
                isChsRouteIn: this.isChsRouteIn(req)
            }
        };
    }
}

interface HomeViewData extends BaseViewData {
    fees: typeof fees
    isChsRouteIn: boolean
}
