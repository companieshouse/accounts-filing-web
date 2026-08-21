import { Session } from "@companieshouse/node-session-handler";
import { ContextKeys } from "../../../src/utils/constants/context.keys";

export function session_itest_append_company_profile_data(session: Session, companyNumber: string, companyName: string, language: string = "en") {
    session.data.signin_info!.company_number = companyNumber;
    session.setExtraData(ContextKeys.COMPANY_NUMBER, companyNumber);
    session.setExtraData(ContextKeys.COMPANY_NAME, companyName);
    session?.setExtraData(ContextKeys.LANGUAGE, language);
}
