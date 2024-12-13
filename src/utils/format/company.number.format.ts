import { logger } from "../../utils/logger";
import { ValidateCompanyNumberFormat } from "../../utils/validate/validate.company.number";

export function checkCompanyNumberFormatIsValidate(companyNumber: string | undefined) {
    const errorMessage = "Company number has not been set";
    if (companyNumber === undefined) {
        logger.error(errorMessage);
        throw new Error(errorMessage);
    } else if (!ValidateCompanyNumberFormat.isValid(companyNumber)){
        logger.error(`An invalid company number format entered. Total length of input: ${companyNumber.length}. Invalid format companyNumber = [${companyNumber}]`);
        throw new Error("Company number is invalid");
    }
}
