import { ChooseYourPackageAccountsHandler } from "../../../../src/routers/handlers/choose_your_package_accounts/choose.your.package.accounts";
import { ContextKeys } from "../../../../src/utils/constants/context.keys";
import { mockSession } from "../../../mocks/session.middleware.mock";
import { getSessionRequest } from "../../../mocks/session.mock";

describe("Choose your package accounts handler", () => {

    let handler;
    let mockReq: Partial<Request>;

    beforeEach(() => {
        Object.assign(mockSession, getSessionRequest());
        mockSession.setExtraData(ContextKeys.IS_CHS_JOURNEY, true);
        mockSession.data.signin_info!.company_number =  "0000000";

        mockReq = {
            params: { fileId: "ABC" },
            query: { lang: "en" },
            session: mockSession,
            protocol: 'http',
            get: function(s): any {
                if (s === 'host') {
                    return 'chs.local';
                }
            }
        };
    });

    it("Should throw an error if email is not present", () => {
        handler = new ChooseYourPackageAccountsHandler();
        expect(() => {handler.getViewData(mockReq);}).toThrow("Unable to find email in session");
    });
});
