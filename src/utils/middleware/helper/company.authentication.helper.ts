import { Request } from "express";
import { createAndLogError } from "../../../utils/logger";
import { URL_QUERY_PARAM } from "../../../utils/constants/urls";
import { ContextKeys } from "../../../utils/constants/context.keys";


export class CompanyAuthenticationHelper {

    static getCompanyNumberFromRequest(req: Request): string {
        const companyNumber = req.query[URL_QUERY_PARAM.PARAM_COMPANY_NUMBER];
        if (typeof companyNumber !== "string") {
            throw createAndLogError(`companyNumber query parameter is not of type string. companyNumber = [${companyNumber}]`);
        }
        return companyNumber;
    }

    static getCompanyNumberFromExtraData(req: Request): string | undefined {
        const companyNumber: string | undefined = req.session?.getExtraData(ContextKeys.COMPANY_NUMBER);
        return companyNumber;
    }
}
