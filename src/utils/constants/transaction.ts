import { env } from "../../config";

export const TRANSACTION_REFERENCE = env.APP_NAME;
export const TRANSACTION_DESCRIPTION = "Accounts Filing Web";

export const TransactionStatuses = {
    CLOSED: "closed",
};
