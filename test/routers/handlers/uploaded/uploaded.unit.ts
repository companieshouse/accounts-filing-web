import { Request } from "express";
import { UploadedHandler } from "../../../../src/routers/handlers/uploaded/uploaded";
import { AccountValidatorResponse } from "private-api-sdk-node/dist/services/account-validator/types";
import { mockAccountsFilingService } from "../../../mocks/accounts.filing.service.mock";
import { Session } from "@companieshouse/node-session-handler";
import { ContextKeys } from "../../../../src/utils/constants/context.keys";

const validUUIDv4 = "bffebd2c-3848-43d2-a37a-78a93983ff52";

describe("UploadedHandler", () => {
    let handler: UploadedHandler;
    let mockReq: Partial<Request>;

    const session = {
        data: {
            signin_info: {
                company_number: "00000000"
            }
        },
        getExtraData: jest.fn((input) => {
            if (input === ContextKeys.ACCOUNTS_FILING_ID){
                return "Placeholder accountsFilingId";
            } else if (input === ContextKeys.TRANSACTION_ID){
                return "Placeholder transactionId";
            } else if (input === ContextKeys.PACKAGE_TYPE){
                return "uksef";
            }
        }),
        setExtraData: jest.fn((input) => {
            if (input === ContextKeys.VALIDATION_STATUS){
                return "invalid-uuid";
            }
        })
    } as unknown as Session;

    beforeEach(() => {
        jest.clearAllMocks();

        handler = new UploadedHandler(mockAccountsFilingService);
        mockReq = {
            params: { fileId: validUUIDv4 },
            session: session,
            protocol: 'http',
            get: function(s): any {
                if (s === 'host') {
                    return 'chs.local';
                }
            }
        };
    });

    function setRequestFileID(fileId: string) {
        if (mockReq.params) {
            mockReq.params.fileId = fileId;
        }
    }

    describe("execute method", () => {
        it("should call getValidationStatus with valid fileId", async () => {
            setRequestFileID(validUUIDv4);
            mockAccountsFilingService.getValidationStatus.mockResolvedValue({
                resource: {} as AccountValidatorResponse,
                httpStatusCode: 200,
            });

            await handler.executeGet(mockReq as Request, {} as any);

            const expectedCallValue = {
                accountsFilingId: "Placeholder accountsFilingId",
                fileId: "bffebd2c-3848-43d2-a37a-78a93983ff52",
                transactionId: "Placeholder transactionId",
            };
            expect(
                mockAccountsFilingService.getValidationStatus
            ).toHaveBeenCalledWith(expectedCallValue);
        });

        it("should return result with valid fileId", async () => {
            setRequestFileID(validUUIDv4);
            const mockResult = {
                resource: {} as AccountValidatorResponse,
                httpStatusCode: 200,
            };
            mockAccountsFilingService.getValidationStatus.mockResolvedValue(
                mockResult
            );

            const result = await handler.executeGet(mockReq as Request, {} as any);

            expect(result.result).toEqual(mockResult.resource);
        });

        it("should not call getValidationStatus with invalid fileId", async () => {
            setRequestFileID("invalid-uuid");

            await handler.executeGet(mockReq as Request, {} as any);

            expect(
                mockAccountsFilingService.getValidationStatus
            ).not.toHaveBeenCalled();
        });

        it("should not return result with invalid fileId", async () => {
            setRequestFileID("invalid-uuid");

            const result = await handler.executeGet(mockReq as Request, {} as any);

            expect(result.result).toBeUndefined();
        });
    });
});
