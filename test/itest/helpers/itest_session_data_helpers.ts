import { Session } from "@companieshouse/node-session-handler";
import { ContextKeys } from "../../../src/utils/constants/context.keys";
import { getLoggedInSessionWithEmail } from "../../mocks/session.mock";

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
    session?.setExtraData(ContextKeys.LANGUAGE, language);
}
