import { SessionKey } from "@companieshouse/node-session-handler/lib/session/keys/SessionKey";
import { SignInInfoKeys } from "@companieshouse/node-session-handler/lib/session/keys/SignInInfoKeys";
import { ISignInInfo } from "@companieshouse/node-session-handler/lib/session/model/SessionInterfaces";
import { AccessTokenKeys } from "@companieshouse/node-session-handler/lib/session/keys/AccessTokenKeys";
import { Session } from "@companieshouse/node-session-handler";
import { ContextKeys } from "./constants/context.keys";
import { createAndLogError } from "./logger";
import { AccountValidatorResponse } from "private-api-sdk-node/dist/services/account-validator/types";

export function getSignInInfo(session: Session): ISignInInfo | undefined {
    return session?.data?.[SessionKey.SignInInfo];
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

export function getRequiredStringValue(
    session: Session,
    key: string,
    errorText: string
): string | Error {
    const value =
        key === "company_number"
            ? session.data.signin_info?.company_number
            : session.getExtraData(key);
    if (typeof value === "string") {
        return value;
    }
    return new Error(errorText);
}

export function getTransactionId(session: Session): string | Error {
    return getRequiredStringValue(
        session,
        ContextKeys.TRANSACTION_ID,
        "Unable to find transactionId in session"
    );
}

export function getAccountsFilingId(session: Session): string | Error {
    return getRequiredStringValue(
        session,
        ContextKeys.ACCOUNTS_FILING_ID,
        "Unable to find accountsFilingId in session"
    );
}

export function getCompanyNumber(session: Session): string | Error {
    return getRequiredStringValue(
        session,
        "company_number",
        "Unable to find company number in session"
    );
}

export function setValidationResult(session: Session | undefined, validationResponse: AccountValidatorResponse) {
    session?.setExtraData(ContextKeys.VALIDATION_STATUS, validationResponse);
}

export function getValidationResult(session: Session | undefined): AccountValidatorResponse | Error {
    const status = session?.getExtraData(ContextKeys.VALIDATION_STATUS);
    if (status === undefined) {
        return new Error(`Validation status not found in session`);
    }

    return status as AccountValidatorResponse;
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
