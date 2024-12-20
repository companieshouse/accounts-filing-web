import { SessionKey } from "@companieshouse/node-session-handler/lib/session/keys/SessionKey";
import { SignInInfoKeys } from "@companieshouse/node-session-handler/lib/session/keys/SignInInfoKeys";
import { ISignInInfo, IUserProfile } from "@companieshouse/node-session-handler/lib/session/model/SessionInterfaces";
import { AccessTokenKeys } from "@companieshouse/node-session-handler/lib/session/keys/AccessTokenKeys";
import { Session } from "@companieshouse/node-session-handler";
import { ContextKeys } from "./constants/context.keys";
import { createAndLogError } from "./logger";
import { PackageType } from "@companieshouse/api-sdk-node/dist/services/accounts-filing/types";
import { AccountValidatorResponse } from "@companieshouse/api-sdk-node/dist/services/account-validator/types";

export function getSignInInfo(session: Session): ISignInInfo | undefined {
    return session?.data?.[SessionKey.SignInInfo];
}

export function getUserProfile(session: Session): IUserProfile | undefined {
    const signInInfo = getSignInInfo(session);
    return signInInfo?.user_profile;
}

export function getAccessToken(session: Session): string {
    const signInInfo = getSignInInfo(session);
    return signInInfo?.[SignInInfoKeys.AccessToken]?.[
        AccessTokenKeys.AccessToken
    ] as string;
}

export function must<T>(value: T | Error | undefined): T {
    if (value === undefined) {
        value = new Error(`Required value not found`);
    }

    if (value instanceof Error) {
        // Enchance error message to include the name of the caller function.
        const error = new Error();
        const stackLines = error.stack?.split("\n") || [];
        let callerName = "unknown function";

        const mustFunctionLineIndex = stackLines.findIndex((line) =>
            line.includes("must")
        );
        if (
            mustFunctionLineIndex !== -1 &&
            stackLines.length > mustFunctionLineIndex + 1
        ) {
            const callerLine = stackLines[mustFunctionLineIndex + 1];

            const match = callerLine.match(/at (?:(?:async )?(.*?) \(|(\S+))/);
            if (match) {
                callerName = match[1] || match[2] || callerName;
            }
        }

        value.message = `[${callerName}] ${value.message}`;
        throw value;
    }

    return value;
}

export function getRequiredValue<T>(
    session: Session | undefined,
    key: string,
    errorText: string
): T | Error {
    if (session === undefined) {
        throw createAndLogError(`Unable to get value from session as session is undefined`);
    }

    const value =
        key === "company_number"
            ? session.data.signin_info?.company_number
            : session.getExtraData(key);

    if (value !== undefined && value !== null) {
        return value as T;
    }

    return new Error(errorText);
}

export function getTransactionId(session?: Session): string | Error {
    return getRequiredValue(
        session,
        ContextKeys.TRANSACTION_ID,
        "Unable to find transactionId in session"
    );
}

export function getAccountsFilingId(session?: Session): string | Error {
    return getRequiredValue(
        session,
        ContextKeys.ACCOUNTS_FILING_ID,
        "Unable to find accountsFilingId in session"
    );
}

export function getCompanyNumber(session?: Session): string | Error {
    return getRequiredValue(
        session,
        ContextKeys.COMPANY_NUMBER,
        "Unable to find company number in session"
    );
}

export function setValidationResult(session: Session | undefined, validationResponse: AccountValidatorResponse) {
    session?.setExtraData(ContextKeys.VALIDATION_STATUS, validationResponse);
}

export function getValidationResult(session?: Session | undefined): AccountValidatorResponse | Error {
    return getRequiredValue(session, ContextKeys.VALIDATION_STATUS, "Unable to find validation status in session");
}

export function deleteValidationResult(session?: Session | undefined) {
    session?.deleteExtraData(ContextKeys.VALIDATION_STATUS);
}

export function checkUserSignedIn(session: Session): boolean {
    const signInInfo = getSignInInfo(session);
    return signInInfo?.[SignInInfoKeys.SignedIn] === 1;
}

export function getRefreshToken(session: Session): string {
    const signInInfo = getSignInInfo(session);
    return signInInfo?.[SignInInfoKeys.AccessToken]?.[
        AccessTokenKeys.RefreshToken
    ] as string;
}

export function setAccessToken(session: Session, accessToken: string) {
    const acccessTokenObject =
        getSignInInfo(session)?.[SignInInfoKeys.AccessToken];
    if (acccessTokenObject === undefined) {
        throw createAndLogError(`Unable to set access token in session as there is not access token object in the sessions sign in info.`);
    }

    acccessTokenObject.access_token = accessToken;
}

export function setPackageType(session: Session | undefined, packageType: PackageType): void {
    session?.setExtraData(ContextKeys.PACKAGE_TYPE, packageType);
}

export function getPackageType(session?: Session): PackageType | Error {
    return getRequiredValue(
        session,
        ContextKeys.PACKAGE_TYPE,
        "Unable to find package type in session"
    );
}

export function setCompanyName(session: Session | undefined, companyName: string) {
    session?.setExtraData(ContextKeys.COMPANY_NAME, companyName);
}

export function getCompanyName(session?: Session | undefined): string | Error {
    return getRequiredValue(session, ContextKeys.COMPANY_NAME, "Unable to find company name in session");
}

export function setExtraDataCompanyNumber(session: Session | undefined, companyNumber: string) {
    session?.setExtraData(ContextKeys.COMPANY_NUMBER, companyNumber);
}

export function getCompanyNumberFromExtraData(session: Session | undefined): string | undefined {
    const companyNumber: string | undefined = session?.getExtraData(ContextKeys.COMPANY_NUMBER);
    return companyNumber;
}

export function setLanguage(session: Session | undefined, language: string) {
    session?.setExtraData(ContextKeys.LANGUAGE, language);
}

export function setIsChsJourney(session: Session | undefined, isChsJourney: boolean) {
    session?.setExtraData(ContextKeys.IS_CHS_JOURNEY, isChsJourney);
}

export function getIsChsJourneyFromExtraData(session: Session | undefined): boolean | undefined {
    const isChsJourney: boolean | undefined = session?.getExtraData(ContextKeys.IS_CHS_JOURNEY);
    return isChsJourney ?? false;
}
