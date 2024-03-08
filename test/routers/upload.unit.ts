import { Transaction } from "@companieshouse/api-sdk-node/dist/services/transaction/types";
import { Request, Response } from "express";
import { UploadHandler } from "../../src/routers/handlers/upload/upload";
import { TransactionService as LocalTransactionService } from "../../src/services/external/transaction.service";

jest.mock('@companieshouse/api-sdk-node/dist/client', () => {
    return jest.fn().mockImplementation(() => {
        return {
            transactionService: {
                postTransactionRecord: jest.fn()
            }
        }
    })
})

jest.mock('../../src/utils/constants/context.keys', () => {
    return {
        ContextKeys: {
            TRANSACTION_ID: "transactionId"
        }
    }
})

function createReq(companyName: string | undefined) {
    return {
        session: {
            data: {
                signin_info: {
                    access_token: {
                        access_token: "access_token"
                    },
                    company_number: companyName
                },
                extra_data: {}
            },
            setExtraData: jest.fn()
        },
        protocol: `PROTOCOL`,
        get: jest.fn()
    } as unknown as Request;
}


describe("UploadHandler", () => {

    let req: Request;

    let res: Response;

    let service: UploadHandler;

    const mockPostTransactionRecord = jest.fn<Promise<Transaction>, [string, string, string]>();

    beforeEach(() => {
        jest.resetAllMocks();

        service = new UploadHandler({
            postTransactionRecord: mockPostTransactionRecord
        } as unknown as LocalTransactionService);

        res = {} as unknown as Response;
    })

    it("should redirection execute calls", async () => {
        req = createReq("1");
        const handler = service;
        mockPostTransactionRecord.mockResolvedValue({ id: 1 } as unknown as Transaction);
        let a = await handler.execute(req, res);
        await expect(handler.execute(req, res)).resolves.toEqual(`http://chs.locl/xbrl_validate/submit?callback=PROTOCOL%3A%2F%2Fundefined%2Faccounts-filing%2Fuploaded%2F%7BfileId%7D&backUrl=PROTOCOL%3A%2F%2Fundefined%2Faccounts-filing`);
    });

    it("should return transaction id for callTransactionApi calls", async () => {
        req = createReq("1");
        const handler = service;
        mockPostTransactionRecord.mockResolvedValue({ id: 1 } as unknown as Transaction)
        await expect(handler.callTransactionApi(req, res)).resolves.toEqual(1);
    })

    it("should throw no company number when no company is in session for callTransactionApi calls", async () => {
        req = createReq(undefined);
        const handler = service;
        await expect(handler.callTransactionApi(req, res)).rejects.toEqual(Error("No company number"));
    })

    it("should throw Issue with service if postTransactionRecord fails for callTransactionApi calls", async () => {
        req = createReq("1");
        const handler = service;
        await expect(handler.callTransactionApi(req, res)).rejects.toEqual(Error("Issue with service"));
    })
})