import { formatToUKString } from "../../../src/utils/format/format";

describe("FormatDate", () => {

    const date = "1999-12-31";

    it("should convert a date string to a uk format", () => {
        expect(formatToUKString(date)).toEqual(
            "31 December 1999"
        );
    });
});
