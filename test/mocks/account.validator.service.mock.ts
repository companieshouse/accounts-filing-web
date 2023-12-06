import PrivateApiClient from "private-api-sdk-node/dist/client";
import { AccountValidationService } from "../../src/services/external/account.validation.service";

jest.mock("../../src/services/external/account.validation.service");

export const accountValidationServiceMock = new AccountValidationService({} as PrivateApiClient) as jest.Mocked<AccountValidationService>;
