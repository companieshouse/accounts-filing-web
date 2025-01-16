
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
