import { Request } from "express";
import { UploadedHandler } from "../../../../src/routers/handlers/uploaded/uploaded";
import { AccountValidatorResponse } from "private-api-sdk-node/dist/services/account-validator/types";
import { accountValidationServiceMock } from "../../../mocks/account.validator.service.mock";

const validUUIDv4 = "bffebd2c-3848-43d2-a37a-78a93983ff52";

describe('UploadedHandler', () => {
    let handler: UploadedHandler;
    let mockReq: Partial<Request>;

    beforeEach(() => {
        jest.clearAllMocks();

        handler = new UploadedHandler(accountValidationServiceMock);
        mockReq = {
            params: { fileId: validUUIDv4 },
        };
    });

    function setRequestFileID(fileId: string) {
        if (mockReq.params) {
            mockReq.params.fileId = fileId;
        }
    }

    describe('execute method', () => {
        it('should call getValidationStatus with valid fileId', async () => {
            setRequestFileID(validUUIDv4);
            accountValidationServiceMock.getValidationStatus.mockResolvedValue({ resource: {} as AccountValidatorResponse, httpStatusCode: 200 });

            await handler.execute(mockReq as Request, {} as any);

            expect(accountValidationServiceMock.getValidationStatus).toHaveBeenCalledWith(validUUIDv4);
        });

        it('should return result with valid fileId', async () => {
            setRequestFileID(validUUIDv4);
            const mockResult = { resource: {} as AccountValidatorResponse, httpStatusCode: 200 };
            accountValidationServiceMock.getValidationStatus.mockResolvedValue(mockResult);

            const result = await handler.execute(mockReq as Request, {} as any);

            expect(result.result).toEqual(mockResult.resource);
        });

        it('should not call getValidationStatus with invalid fileId', async () => {
            setRequestFileID('invalid-uuid');

            await handler.execute(mockReq as Request, {} as any);

            expect(accountValidationServiceMock.getValidationStatus).not.toHaveBeenCalled();
        });

        it('should not return result with invalid fileId', async () => {
            setRequestFileID('invalid-uuid');

            const result = await handler.execute(mockReq as Request, {} as any);

            expect(result.result).toBeUndefined();
        });
    });
});
