import { Request } from "express";
import { UploadedHandler } from "../../../../src/routers/handlers/uploaded/uploaded";
import { AccountValidatorResponse } from "private-api-sdk-node/dist/services/account-validator/types";
import { accountsFilingServiceMock } from "../../../mocks/accounts.filing.service.mock";

const validUUIDv4 = "bffebd2c-3848-43d2-a37a-78a93983ff52";

describe("UploadedHandler", () => {
    let handler: UploadedHandler;
    let mockReq: Partial<Request>;

    beforeEach(() => {
        jest.clearAllMocks();

        handler = new UploadedHandler(accountsFilingServiceMock);
        mockReq = {
            params: { fileId: validUUIDv4 },
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
            accountsFilingServiceMock.getValidationStatus.mockResolvedValue({
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
                accountsFilingServiceMock.getValidationStatus
            ).toHaveBeenCalledWith(expectedCallValue);
        });

        it("should return result with valid fileId", async () => {
            setRequestFileID(validUUIDv4);
            const mockResult = {
                resource: {} as AccountValidatorResponse,
                httpStatusCode: 200,
            };
            accountsFilingServiceMock.getValidationStatus.mockResolvedValue(
                mockResult
            );

            const result = await handler.executeGet(mockReq as Request, {} as any);

            expect(result.result).toEqual(mockResult.resource);
        });

        it("should not call getValidationStatus with invalid fileId", async () => {
            setRequestFileID("invalid-uuid");

            await handler.executeGet(mockReq as Request, {} as any);

            expect(
                accountsFilingServiceMock.getValidationStatus
            ).not.toHaveBeenCalled();
        });

        it("should not return result with invalid fileId", async () => {
            setRequestFileID("invalid-uuid");

            const result = await handler.executeGet(mockReq as Request, {} as any);

            expect(result.result).toBeUndefined();
        });
    });
});
