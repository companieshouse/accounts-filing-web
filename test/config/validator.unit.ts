import { readEnv, Validators } from "../../src/config/validator";

describe("config validator tests", () => {
    it("Should validate string variables", () => {
        const testEnv = {
            TEST: "test",
        };

        const env = readEnv(testEnv, {
            TEST: Validators.str,
        });

        expect(env.TEST).toBe("test");
    });

    it("Should throw an error when missing a variable", () => {
        const testEnv = {};

        expect(() => {
            readEnv(testEnv, {
                TEST: Validators.str,
            });
        }).toThrowError(`Value is undefined or null.`);
    });

    it("Should not throw an error when missing a variable with a default value", () => {
        const testEnv = {};

        const env = readEnv(testEnv, {
            TEST: Validators.str.default("test"),
        });

        expect(env.TEST).toBe("test");
    });

    it("Should validate numbers", () => {
        const testEnv = {
            TEST_1: "42.01",
            TEST_2: "1234",
        };

        const env = readEnv(testEnv, {
            TEST_1: Validators.number,
            TEST_2: Validators.number,
        });

        expect(env.TEST_1).toBe(42.01);
        expect(env.TEST_2).toBe(1234);
    });

    it("Should not validate invalid numbers", () => {
        const testEnv = {
            TEST: "jhgjhg",
        };

        expect(() => readEnv(testEnv, {
            TEST: Validators.number,
        })).toThrow();
    });

    it("Should validate ints", () => {
        const testEnv = {
            TEST: "42",
        };

        const env = readEnv(testEnv, {
            TEST: Validators.int,
        });

        expect(env.TEST).toBe(42);
    });

    it("Should not validate decimals as ints", () => {
        const testEnv = {
            TEST: "42.01",
        };

        expect(() =>
            readEnv(testEnv, {
                TEST: Validators.int,
            })
        ).toThrow();
    });

    it("Should validate valid emails", () => {
        const testEnv = {
            TEST_1: "test@example.com",
            TEST_2: "firstname.lastname@domain.tld",
            TEST_3: "email+tag@example.com",
        };

        const env = readEnv(testEnv, {
            TEST_1: Validators.email,
            TEST_2: Validators.email,
            TEST_3: Validators.email,
        });

        expect(env.TEST_1).toBe("test@example.com");
        expect(env.TEST_2).toBe("firstname.lastname@domain.tld");
        expect(env.TEST_3).toBe("email+tag@example.com");
    });

    it("Should not validate invalid emails", () => {
        const expectFail = (email: string) => {
            const testEnv = {
                TEST: email,
            };
            expect(() =>
                readEnv(testEnv, {
                    TEST: Validators.email,
                })
            ).toThrow();
        };

        const invalidEmails = [
            "notanemail", // it's not an email at all
            "missingatsymbol.com", // is missing the @ symbol
            "missingdomain@.com", // `is missing the domain name
        ];

        invalidEmails.forEach(expectFail);
    });

    it("Should validate valid URLs", () => {
        const testEnv = {
            TEST_1: "http://example.com",
            TEST_2: "https://example.com/path?query=param",
        };

        const env = readEnv(testEnv, {
            TEST_1: Validators.url,
            TEST_2: Validators.url,
        });

        expect(env.TEST_1).toBe("http://example.com");
        expect(env.TEST_2).toBe("https://example.com/path?query=param");
    });

    it("Should not validate invalid URLs", () => {
        const expectFail = (url: string) => {
            const testEnv = {
                TEST: url,
            };
            expect(() =>
                readEnv(testEnv, {
                    TEST: Validators.url,
                })
            ).toThrow();
        };

        const invalidUrls = [
            "notanurl",
        ];

        invalidUrls.forEach(expectFail);
    });

    it("Should validate valid ports", () => {
        const testEnv = {
            TEST_1: "80",
            TEST_2: "65535",
        };

        const env = readEnv(testEnv, {
            TEST_1: Validators.port,
            TEST_2: Validators.port,
        });

        expect(env.TEST_1).toBe(80);
        expect(env.TEST_2).toBe(65535);
    });

    it("Should not validate invalid ports", () => {
        const expectFail = (port: string) => {
            const testEnv = {
                TEST: port,
            };
            expect(() =>
                readEnv(testEnv, {
                    TEST: Validators.port,
                })
            ).toThrow();
        };

        const invalidPorts = [
            "-1", // it's not a valid port number
            "65536", // it's not a valid port number
            "notaport" // it's not a number at all
        ];

        invalidPorts.forEach(expectFail);
    });

    // For bool validator
    it("Should validate valid boolean values", () => {
        const testEnv = {
            TEST_1: "true",
            TEST_2: "No",
            TEST_3: "1",
            TEST_4: "off",
        };

        const env = readEnv(testEnv, {
            TEST_1: Validators.bool,
            TEST_2: Validators.bool,
            TEST_3: Validators.bool,
            TEST_4: Validators.bool,
        });

        expect(env.TEST_1).toBe(true);
        expect(env.TEST_2).toBe(false);
        expect(env.TEST_3).toBe(true);
        expect(env.TEST_4).toBe(false);
    });

    it("Should not validate invalid boolean values", () => {
        const expectFail = (bool: string) => {
            const testEnv = {
                TEST: bool,
            };
            expect(() =>
                readEnv(testEnv, {
                    TEST: Validators.bool,
                })
            ).toThrow();
        };

        const invalidBools = [
            "notaboolean", // it's not a valid boolean value`
            "maybe" // it's not a valid boolean value`
        ];

        invalidBools.forEach(expectFail);
    });
});
