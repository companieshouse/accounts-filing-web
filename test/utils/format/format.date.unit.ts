import { FormatDate } from "../../../src/utils/format/format.date";

describe("FormatDate", () => {

    const date = "1999-12-31";

    it("should convert a date string to a uk format", () => {
        expect(FormatDate.formatToUKString(date)).toEqual(
            "31 December 1999"
        );
    });
});
