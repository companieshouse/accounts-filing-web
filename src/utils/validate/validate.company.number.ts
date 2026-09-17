import { env } from "../../config";

export class ValidateCompanyNumberFormat {
    private static COMPANY_NUMBER_REGEX: RegExp = /^[A-Z0-9]{2}[0-9]{6}$/;


    static isValid(companyNumber: string): boolean {

        if (typeof companyNumber !== "string") {
            return false;
        }

        const capCompanyNumber = companyNumber.toLocaleUpperCase();
        return this.COMPANY_NUMBER_REGEX.test(capCompanyNumber);
    }

}

export function isBranchRegistrationNumber(companyNumber: string): boolean {
    return companyNumber.toUpperCase().startsWith("BR");
}
export function isLPNumber(companyNumber: string): boolean {
    return companyNumber.toUpperCase().startsWith("LP");
}
export function isSLPNumber(companyNumber: string): boolean {
    return companyNumber.toUpperCase().startsWith("SL");
}
export function shouldProgressToStopScreen(companyNumber: string) {
    return (
        env.FEATURE_FLAG_BR_COMPANY_STOP_SCREEN_250826 && isBranchRegistrationNumber(companyNumber) ||
        !env.FEATURE_FLAG_ALLOW_LP_COMPANY_TO_USE_SERVICE_170926 && isLPNumber(companyNumber) ||
        !env.FEATURE_FLAG_ALLOW_SLP_COMPANY_TO_USE_SERVICE_170926 && isSLPNumber(companyNumber)
    );
}
