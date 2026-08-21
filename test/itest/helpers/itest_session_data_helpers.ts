import { Session } from "@companieshouse/node-session-handler";
import { ContextKeys } from "../../../src/utils/constants/context.keys";
import { getLoggedInSessionWithEmail } from "../../mocks/session.mock";
import { AccountValidatorResponse } from "@companieshouse/api-sdk-node/dist/services/account-validator/types";

export function session_itest_fully_clear_session(session: Session) {
    // Remove any unknown properties that implicitly untrusted code may have added
    for (const key of Reflect.ownKeys(session)) {
        delete (session as any)[key];
    }
    // Restore all properties set on a blank session as we may deleted important internal properties
    Object.assign(session, new Session());
}

export function session_itest_overwrite_session_login(session: Session) {
    Object.assign(session, getLoggedInSessionWithEmail());
}

export function session_itest_append_company_profile_data(session: Session, companyNumber: string, companyName: string, language: string = "en") {
    session.data.signin_info!.company_number = companyNumber;
    session.setExtraData(ContextKeys.COMPANY_NUMBER, companyNumber);
    session.setExtraData(ContextKeys.COMPANY_NAME, companyName);
    session.setExtraData(ContextKeys.LANGUAGE, language);
}

export function session_itest_append_package_type(session: Session, packageType: string) {
    session.setExtraData(ContextKeys.PACKAGE_TYPE, packageType);
}

export function session_itest_append_pre_upload_data(session: Session, transactionId: string, accountsFilingId: string) {
    session.setExtraData(ContextKeys.TRANSACTION_ID, transactionId);
    session.setExtraData(ContextKeys.ACCOUNTS_FILING_ID, accountsFilingId);
}

export function session_itest_append_validation_result(session: Session, validationResult: AccountValidatorResponse) {
    session.setExtraData(ContextKeys.VALIDATION_STATUS, validationResult);
}

export function session_itest_mark_as_chs_journey(session: Session) {
    session.setExtraData(ContextKeys.IS_CHS_JOURNEY, true);
}
