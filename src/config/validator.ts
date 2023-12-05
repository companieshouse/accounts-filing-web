// Simple Maybe Monad
type Maybe<T> = Just<T> | Nothing;

class Just<T> {
    constructor(public value: T) {}
    isJust(): this is Just<T> {
        return true;
    }
    isNothing(): this is Nothing {
        return !this.isJust();
    }
}

class Nothing {
    isJust(): this is Just<never> {
        return false;
    }
    isNothing(): this is Nothing {
        return true;
    }
}

type Validator<T> = (input: string | null | undefined) => Maybe<T>;

class ValidatorBuilder<T> {
    constructor(
        private validateFn: (input: string | undefined | null) => Maybe<T>,
        private description: string = ''
    ) {}

    static from<T>(validateFn: Validator<T>): ValidatorBuilder<T> {
        return new ValidatorBuilder(validateFn);
    }

    map<R>(f: (wrapped: T) => R): ValidatorBuilder<R> {
        return new ValidatorBuilder<R>((s: string | undefined | null) => {
            const maybe = this.validateFn(s);
            return maybe.isJust() ? new Just(f(maybe.value)) : new Nothing();
        });
    }

    describe(description: string): ValidatorBuilder<T> {
        return new ValidatorBuilder<T>(this.validateFn, description);
    }

    default<R>(defaultValue: R): ValidatorBuilder<R | T> {
        return new ValidatorBuilder<R | T>((s: string | undefined | null) => {
            if (s === undefined || s === null) {
                return new Just(defaultValue);
            }
            const maybe = this.validateFn(s);
            return maybe.isJust() ? new Just(maybe.value as T) : new Nothing();
        });
    }

    in(validOptions: T[]): ValidatorBuilder<T> {
        return new ValidatorBuilder<T>((s: string | undefined | null) => {
            const maybe = this.validateFn(s);
            if (maybe.isJust()) {
                if (validOptions.includes(maybe.value)) {
                    return new Just(maybe.value);
                } else {
                    throw new Error(`'${maybe.value}' is not a valid option. Valid options are: ${validOptions.join(', ')}`);
                }
            } else {
                return new Nothing();
            }
        });
    }

    validate(s: string | undefined | null): Maybe<T> {
        const maybe = this.validateFn(s);
        if (maybe.isNothing() && this.description) {
            throw new Error(`Validation failed for variable: ${this.description}`);
        }
        return maybe;
    }
}

const strValidator = ValidatorBuilder.from<string>(
    (s: string | undefined | null) => {
        if (s === undefined || s === null) {
            throw new Error("Value is undefined or null.");
        }
        return new Just(s);
    }
);

const intValidator = strValidator
    .map<string>((s) => s.trim())
    .map<number>((s) => {
        const num = Number(s);
        if (isNaN(num) || num % 1 !== 0) {
            throw new Error(`'${s}' is not a valid integer.`);
        }
        return num;
    });

const numberValidator = strValidator
    .map<string>((s) => s.trim())
    .map<number>((s) => {
        const num = parseFloat(s);
        if (isNaN(num)) {
            throw new Error(`'${s}' is not a valid number.`);
        }
        return num;
    });

// Source: https://urlregex.com
// eslint-disable-next-line no-useless-escape
const urlRegex = new RegExp(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/, 'i');
const urlValidator = strValidator
    .map<string>((s) => s.trim())
    .map<string>((s) => {
        if (!urlRegex.test(s)) {
            throw new Error(`'${s}' is not a valid URL.`);
        }
        return s;
    });


// Source: https://regexpattern.com/email-address/
// eslint-disable-next-line no-useless-escape
const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
const emailValidator = strValidator
    .map<string>((s) => s.trim())
    .map<string>((s) => {
        if (!emailRegex.test(s)) {
            throw new Error(`'${s}' is not a valid email.`);
        }
        return s;
    });

const portValidator = strValidator
    .map<string>((s) => s.trim())
    .map<number>((s) => {
        const port = parseInt(s);
        if (isNaN(port) || port < 0 || port > 65535) {
            throw new Error(`'${s}' is not a valid port number.`);
        }
        return port;
    });

const boolValidator = strValidator
    .map<string>((s) => s.trim().toLowerCase())
    .map<boolean>((s) => {
        switch (s) {
                case "true":
                case "1":
                case "yes":
                case "y":
                case "on":
                    return true;
                case "false":
                case "0":
                case "no":
                case "n":
                case "off":
                    return false;
                default:
                    throw new Error(
                        `Invalid boolean value '${s}'. Expected true/false, 1/0, yes/no, y/n, on/off.`
                    );
        }
    });

export const Validators = {
    str: strValidator,
    int: intValidator,
    number: numberValidator,
    url: urlValidator,
    email: emailValidator,
    port: portValidator,
    bool: boolValidator,
};

export type Env<S> = S extends Record<string, ValidatorBuilder<unknown>>
    ? {
          [K in keyof S]: S[K] extends ValidatorBuilder<infer U> ? U : never;
      }
    : never;


export function readEnv<S extends Record<string, ValidatorBuilder<unknown>>>(source: Record<string, string | undefined>, schema: S): Readonly<Env<S>> {
    const vars: Record<string, unknown> = {};

    const errors: {key: string, message: string}[] = [];

    for (const [k, v] of Object.entries(schema)) {
        const err = { key: k };
        try {
            const value = v.validate(source[k]);
            if (value.isNothing()) {
                errors.push({ ...err, message: `Key not found` });
            } else {
                vars[k] = value.value;
            }
        } catch (e) {
            if (e instanceof Error) {
                errors.push({ ...err, message: e.message });
            } else {
                errors.push({ ...err, message: `${e}` });
            }
        }
    }

    if (errors.length > 0) {
        const errorMessage = `Unable loading config variables from environment.\n
        Experienced the following errors:\n` + errors.map(e => `${e.key} - ${e.message}`).join('\n');

        throw new Error(errorMessage);
    }

    return vars as Env<S>;
}

const protocolRegex = /^(http:\/\/|https:\/\/|\/\/)/i;
// Some config parameters don't have protocols e.g. CDN_HOST.
// This funciton adds '//' which is a protocol relative protocol to the url.
// This means if the site is hosted on http it will try to access http://${CDN_HOST}
// If the site is hosted on https it will use https://${CDN_HOST}
export function addProtocolIfMissing(url: string): string {
    if (!protocolRegex.test(url)) {
        return '//' + url;
    } else {
        return url;
    }
}
