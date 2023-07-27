export interface Parser<T> {
    parse(s: string): T;
}

function parseFn<T> (fn: (s: string) => T): Parser<T> {
    return {
        parse: fn
    };
}

export function matches (regexOrString: RegExp | string): Parser<string> {
    const regex = typeof regexOrString === "string"
        ? new RegExp(regexOrString)
        : regexOrString;

    return parseFn(s => {
        const match = regex.exec(s);

        if (match === null) {
            throw new Error(`String input "${s}" does not match regex ${regex}`);
        }

        return match[0];
    });
}

export function url (): Parser<string> {
    return matches(``);
}
