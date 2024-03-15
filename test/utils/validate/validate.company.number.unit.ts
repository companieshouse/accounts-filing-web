import { ValidateCompanyNumber } from "../../../src/utils/validate/validate.company.number";



describe("ValidateCompanyNumber", () => {

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
            ValidateCompanyNumber.isValid(tooLong)
        ).toBe(false);
        expect(
            ValidateCompanyNumber.isValid(tooShort)
        ).toBe(false);
        expect(
            ValidateCompanyNumber.isValid(twoNumbers)
        ).toBe(false);
    });

    it("should return false when using special charactors", () => {
        expect(
            ValidateCompanyNumber.isValid(specialChars)
        ).toBe(false);
    });

    it("should return true when only numbers", () => {
        expect(
            ValidateCompanyNumber.isValid(numeric)
        ).toBe(true);
    });

    it("should return true when it is alphanumeric", () => {
        expect(
            ValidateCompanyNumber.isValid(alphanumeric)
        ).toBe(false);
        expect(
            ValidateCompanyNumber.isValid(alphanumeric2)
        ).toBe(false);
    });

    it("should return true if start with SC or NI", () => {
        expect(
            ValidateCompanyNumber.isValid(niFull)
        ).toBe(true);
        expect(
            ValidateCompanyNumber.isValid(scFull)
        ).toBe(true);

    });

    it("should return false if it only SC or NI", () => {
        expect(
            ValidateCompanyNumber.isValid(scOnly)
        ).toBe(false);
        expect(
            ValidateCompanyNumber.isValid(niOnly)
        ).toBe(false);
    });
});
