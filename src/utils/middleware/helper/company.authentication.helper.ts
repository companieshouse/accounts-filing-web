import { Request } from "express";
import { createAndLogError } from "../../../utils/logger";
import { URL_QUERY_PARAM } from "../../../utils/constants/urls";


export class CompanyAuthenticationHelper {

    static getCompanyNumberFromRequest(req: Request): string {
        const companyNumber = req.query[URL_QUERY_PARAM.PARAM_COMPANY_NUMBER];
        if (typeof companyNumber !== "string") {
            throw createAndLogError(`companyNumber query parameter is not of type string. companyNumber = [${companyNumber}]`);
        }
        return companyNumber;
    }

}
