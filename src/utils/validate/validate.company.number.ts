
export class ValidateCompanyNumber {
    private static COMPANY_NUMBER_REGEX: RegExp = /^(?:SC|NI|[0-9]{2})[0-9]{6}$/;


    static isValid(companyNumber: string): boolean {
        const capCompanyNumber = companyNumber.toLocaleUpperCase();
        return this.COMPANY_NUMBER_REGEX.test(capCompanyNumber);
    }

}
