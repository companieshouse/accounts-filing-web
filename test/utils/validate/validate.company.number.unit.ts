import { ValidateCompanyNumberFormat } from "../../../src/utils/validate/validate.company.number";



describe("ValidateCompanyNumberFormat", () => {

    const tooLong = "123456789";
    const tooShort = "123456";
    const specialChars = "1234567*";
    const numeric = "02345678";
    const alphanumeric = "ABC12345";
    const STARTING_TWO_CHARACTERS = [
        "01", "IC", "NC", "NL", "LP", "CE", "FC",
        "GS", "RC", "SE", "FE", "NF", "RS", "SA",
        "AC", "IP", "OE", "SC", "SG", "SR", "GE",
        "PC", "SL", "SF", "SO", "CS", "NI", "OC",
        "SI", "SP", "SZ", "ZC"
    ];

    it("should return false when length is not 8", () => {
        expect(
            ValidateCompanyNumberFormat.isValid(tooLong)
        ).toBe(false);
        expect(
            ValidateCompanyNumberFormat.isValid(tooShort)
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

    it.each([alphanumeric])("should return false when it a invalid alphanumeric string '%s'", (alphanumericExample) => {
        expect(
            ValidateCompanyNumberFormat.isValid(alphanumericExample)
        ).toBe(false);
    });


    it.each(STARTING_TWO_CHARACTERS)("should return true if start with '%s'", (validFirstCharacters) => {
        expect(
            ValidateCompanyNumberFormat.isValid(validFirstCharacters + "123456")
        ).toBe(true);
    });

    it.each(STARTING_TWO_CHARACTERS)("should return false if it only '%s'", (validFirstCharacters) => {
        expect(
            ValidateCompanyNumberFormat.isValid(validFirstCharacters)
        ).toBe(false);
    });

});
