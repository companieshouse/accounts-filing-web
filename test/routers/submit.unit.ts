import { session } from "../mocks/session.middleware.mock";
import { accountsFilingServiceMock } from "../mocks/accounts.filing.service.mock";
import { AccountsFilingCompanyResponse } from "private-api-sdk-node/dist/services/accounts-filing/types";
import { SubmitHandler } from "../../src/routers/handlers/submit/submit";
import { Request } from "express";
import { ContextKeys } from "../../src/utils/constants/context.keys";

describe("Submit handler tests", () => {
    let handler = new SubmitHandler(accountsFilingServiceMock);
    let mockReq: Partial<Request>;

    beforeEach(() => {
        jest.clearAllMocks();

        handler = new SubmitHandler(accountsFilingServiceMock);
        mockReq = {
            session: session,
            params: {},
            protocol: "http",
            get: function (s): any {
                if (s === "host") {
                    return "chs.local";
                }
            },
        };

        // @ts-expect-error overrides typescript to allow setting the signin_info for testing
        session.data['signin_info'] = { company_number: "123456" } ;
        session.setExtraData("transactionId", "000000-123456-000000");
    });

    it("should return 200 with file upload url ", async () => {
        const mockResult = {
            resource: {
                accountsFilingId: "65e847f791418a767a51ce5d",
            } as AccountsFilingCompanyResponse,
            httpStatusCode: 200,
        };

        accountsFilingServiceMock.checkCompany.mockResolvedValue(mockResult);
        const url = await handler.execute(mockReq as Request, {} as any);

        const expectedUrl =
            "http://chs.locl/xbrl_validate/submit?callback=http%3A%2F%2Fchs.local%2Faccounts-filing%2Fuploaded%2F%7BfileId%7D&backUrl=http%3A%2F%2Fchs.local%2Faccounts-filing";

        expect(accountsFilingServiceMock.checkCompany).toHaveBeenCalledTimes(1);
        expect(url).toEqual(expectedUrl);
        expect(session.getExtraData(ContextKeys.ACCOUNTS_FILING_ID)).toEqual(
            mockResult.resource.accountsFilingId
        );
    });

    it("should throw 500 error for any runtime exception ", async () => {
        const expectedResponse = {
            resource: {} as AccountsFilingCompanyResponse,
            httpStatusCode: 500,
        };

        accountsFilingServiceMock.checkCompany.mockResolvedValue(
            expectedResponse
        );

        try {
            await handler.execute(mockReq as Request, {} as any);
        } catch (error) {
            expect(error).toEqual(expectedResponse as unknown as string);
        }
    });
});
