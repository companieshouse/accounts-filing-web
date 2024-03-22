import { formatToUKString, formatType } from "../../../src/utils/format/format";

describe("formatToUKString", () => {

    const date = "1999-12-31";

    it("should convert a date string to a uk format", () => {
        expect(formatToUKString(date)).toEqual(
            "31 December 1999"
        );
    });
});

describe("formatType", () => {
    const string = "abc-123";
    const result = "abc 123";
    it("should replace '-' with a single space", () => {
        expect(
            formatType(string)
        ).toEqual(result);
    });
});
