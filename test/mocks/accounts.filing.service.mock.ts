import { defaultAccountsFilingService } from "../../src/services/external/accounts.filing.service";

defaultAccountsFilingService.checkCompany = jest.fn();

export const mockDefaultAccountsFilingService = defaultAccountsFilingService as jest.Mocked<typeof defaultAccountsFilingService>;

import PrivateApiClient from "private-api-sdk-node/dist/client";
import { AccountsFilingService } from "../../src/services/external/accounts.filing.service";

jest.mock("../../src/services/external/accounts.filing.service");

export const accountsFilingServiceMock = new AccountsFilingService({} as PrivateApiClient) as jest.Mocked<AccountsFilingService>;

