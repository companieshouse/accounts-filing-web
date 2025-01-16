import { ValidateCompanyNumberFormat } from "../../../src/utils/validate/validate.company.number";



describe("ValidateCompanyNumberFormat", () => {

    const tooLong = "123456789";
    const tooShort = "123456";
    const twoNumbers = "01";
    const specialChars = "1234567*";
    const numeric = "02345678";
    const alphanumeric = "ABC12345";
    const alphanumeric2 = "AB123456";
    const SC = "SC";
    const NI = "NI";
    const OE = "OE";
    const NF = "NF";
    const FC = "FC";
    const OC = "OC";
    const SO = "SO";
    const NC = "NC";

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

    it.each([alphanumeric, alphanumeric2])("should return false when it a invalid alphanumeric string '%s'", (alphanumericExample) => {
        expect(
            ValidateCompanyNumberFormat.isValid(alphanumericExample)
        ).toBe(false);
    });


    it.each([SC, NI, OE, NF,
        FC, OC, SO,
        NC, twoNumbers
    ])("should return true if start with '%s'", (validFirstCharacters) => {
        expect(
            ValidateCompanyNumberFormat.isValid(validFirstCharacters + "123456")
        ).toBe(true);
    });

    it.each([SC, NI, OE, NF,
        FC, OC, SO,
        NC, twoNumbers
    ])("should return false if it only '%s'", (validFirstCharacters) => {
        expect(
            ValidateCompanyNumberFormat.isValid(validFirstCharacters)
        ).toBe(false);
    });

});
