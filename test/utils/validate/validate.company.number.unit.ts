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
    const oeFull = "OE123456";
    const nfFull = "NF123456";
    const fcFull = "FC123456";
    const scOnly = "SC";
    const niOnly = "NI";
    const oeOnly = "OE";

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

    it("should return true if start with SC, NI or OE", () => {
        expect(
            ValidateCompanyNumberFormat.isValid(niFull)
        ).toBe(true);
        expect(
            ValidateCompanyNumberFormat.isValid(scFull)
        ).toBe(true);
        expect(
            ValidateCompanyNumberFormat.isValid(oeFull)
        ).toBe(true);
        expect(
            ValidateCompanyNumberFormat.isValid(nfFull)
        ).toBe(true);
        expect(
            ValidateCompanyNumberFormat.isValid(fcFull)
        ).toBe(true);
    });

    it("should return false if it only SC, NI or OE", () => {
        expect(
            ValidateCompanyNumberFormat.isValid(scOnly)
        ).toBe(false);
        expect(
            ValidateCompanyNumberFormat.isValid(niOnly)
        ).toBe(false);
        expect(
            ValidateCompanyNumberFormat.isValid(oeOnly)
        );
    });
});
