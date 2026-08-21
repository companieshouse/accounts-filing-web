export type Brand<T, BrandName> = T & { readonly __brand: BrandName };
export type RegexString = Brand<string, "regexString">;
