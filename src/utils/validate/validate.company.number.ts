
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
export function isLPRegistrationNumber(companyNumber: string): boolean {
    return companyNumber.toUpperCase().startsWith("LP");
}
export function isSLPRegistrationNumber(companyNumber: string): boolean {
    return companyNumber.toUpperCase().startsWith("SLP");
}
