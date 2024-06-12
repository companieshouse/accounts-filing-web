
export class ValidateCompanyNumberFormat {
    private static COMPANY_NUMBER_REGEX: RegExp = /^(?:SC|NI|OE|FC|NF|[0-9]{2})[0-9]{6}$/;


    static isValid(companyNumber: string): boolean {

        if (!companyNumber) {
            return false;
        }

        const capCompanyNumber = companyNumber.toLocaleUpperCase();
        return this.COMPANY_NUMBER_REGEX.test(capCompanyNumber);
    }

}
