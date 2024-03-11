import { Transaction } from "@companieshouse/api-sdk-node/dist/services/transaction/types";
import { Request } from "express";
import { UploadHandler } from "../../src/routers/handlers/upload/upload";
import { TransactionService as LocalTransactionService } from "../../src/services/external/transaction.service";

import { accountsFilingServiceMock } from "../mocks/accounts.filing.service.mock";
import { AccountsFilingCompanyResponse } from "private-api-sdk-node/dist/services/accounts-filing/types";
import { ContextKeys } from "../../src/utils/constants/context.keys";
import { getSessionRequest } from "../mocks/session.mock";

let session = getSessionRequest();

jest.mock('@companieshouse/api-sdk-node/dist/client', () => {
    return jest.fn().mockImplementation(() => {
        return {
            transactionService: {
                postTransactionRecord: jest.fn()
            }
        };
    });
});

jest.mock('../../src/utils/constants/context.keys', () => {
    return {
        ContextKeys: {
            TRANSACTION_ID: "transactionId",
            ACCOUNTS_FILING_ID: "accountFilingId"
        }
    };
});

describe("UploadHandler", () => {

    const companyNumber = "123456";

    let handler: UploadHandler;

    let mockReq: Partial<Request>;

    const mockPostTransactionRecord = jest.fn<Promise<Transaction>, [string, string, string]>();

    beforeEach(() => {
        jest.resetAllMocks();

        handler = new UploadHandler(
            accountsFilingServiceMock,
            {
                postTransactionRecord: mockPostTransactionRecord
            } as unknown as LocalTransactionService);

        session = getSessionRequest();

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
        session.data['signin_info'] = { company_number: companyNumber };
        session.data.signin_info['access_token'] = { "access_token": "access_token" };
        session.setExtraData("transactionId", "000000-123456-000000");
    });

    it("should return 200 with file upload url ", async () => {
        const mockResult = {
            resource: {
                accountsFilingId: "65e847f791418a767a51ce5d",
            } as AccountsFilingCompanyResponse,
            httpStatusCode: 200,
        };

        mockPostTransactionRecord.mockResolvedValue({ id: 1 } as unknown as Transaction);

        accountsFilingServiceMock.checkCompany.mockResolvedValue(mockResult);
        const url = await handler.execute(mockReq as Request, {} as any);

        const expectedUrl =
            "http://chs.locl/xbrl_validate/submit?callback=http%3A%2F%2Fchs.local%2Faccounts-filing%2Fuploaded%2F%7BfileId%7D&backUrl=http%3A%2F%2Fchs.local%2Faccounts-filing%2F";

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

        mockPostTransactionRecord.mockResolvedValue({ id: 1 } as unknown as Transaction);
        accountsFilingServiceMock.checkCompany.mockResolvedValue(
            expectedResponse
        );

        try {
            await handler.execute(mockReq as Request, {} as any);
        } catch (error) {
            expect(error).toEqual(expectedResponse as unknown as string);
        }
    });

    it("should return transaction id for callTransactionApi calls", async () => {
        mockPostTransactionRecord.mockResolvedValue({ id: 1 } as unknown as Transaction);
        await expect(handler.callTransactionApi(companyNumber)).resolves.toEqual(1);
    });

    it("should throw Issue with service if postTransactionRecord fails for callTransactionApi calls", async () => {
        await expect(handler.callTransactionApi(companyNumber)).resolves.toEqual(undefined);
    });
});
