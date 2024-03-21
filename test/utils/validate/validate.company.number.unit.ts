import { ValidateCompanyNumberFormat } from "../../../src/utils/validate/validate.company.number";



describe("ValidateCompanyNumberFormat", () => {

    const tooLong = "123456789";
    const tooShort = "123456";
    const twoNumbers = "01";
    const specialChars = "1234567*";
    const numeric = "02345678";
    const alphanumeric = "ABC12345";
    const alphanumeric2 = "AB123456";
    const niFull = "NI123456";
    const scFull = "SC123456";
    const scOnly = "SC";
    const niOnly = "NI";

    it("should return false when length is not 8", () => {
        expect(
            ValidateCompanyNumberFormat.isValid(tooLong)
        ).toBe(false);
        expect(
            ValidateCompanyNumberFormat.isValid(tooShort)
        ).toBe(false);
        expect(
            ValidateCompanyNumberFormat.isValid(twoNumbers)
        ).toBe(false);
    });

    it("should return false when using special charactors", () => {
        expect(
            ValidateCompanyNumberFormat.isValid(specialChars)
        ).toBe(false);
    });

    it("should return true when only numbers", () => {
        expect(
            ValidateCompanyNumberFormat.isValid(numeric)
        ).toBe(true);
    });

    it("should return false when it a invalid alphanumeric string", () => {
        expect(
            ValidateCompanyNumberFormat.isValid(alphanumeric)
        ).toBe(false);
        expect(
            ValidateCompanyNumberFormat.isValid(alphanumeric2)
        ).toBe(false);
    });

    it("should return true if start with SC or NI", () => {
        expect(
            ValidateCompanyNumberFormat.isValid(niFull)
        ).toBe(true);
        expect(
            ValidateCompanyNumberFormat.isValid(scFull)
        ).toBe(true);

    });

    it("should return false if it only SC or NI", () => {
        expect(
            ValidateCompanyNumberFormat.isValid(scOnly)
        ).toBe(false);
        expect(
            ValidateCompanyNumberFormat.isValid(niOnly)
        ).toBe(false);
    });
});
