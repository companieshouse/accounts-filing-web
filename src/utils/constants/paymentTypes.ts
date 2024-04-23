import { env } from "../../config";

export type AccountType = Record< "name" | "description" | "fee", string | string |string>;

export type AccountTypes = Record<string, AccountType>;

export const Account: AccountTypes =  {
    cic: { name: "cic", description: "Community Interest Companies", fee: env.CIC_FEE },
    overseas: { name: "overseas", description: "Overseas Companies", fee: env.OVERSEAS_FEE },
    "audit-exempt-subsidiary": { name: "audit-exempt-subsidiary", description: "Audit Exempt Subsidiary Accounts", fee: "-" },
    "filing-exempt-subsidiary": { name: "filing-exempt-subsidiary", description: "Dormant Exempt Subsidiary Accounts", fee: "-" },
    "limited-partnership": { name: "limited-partnership", description: "Limited Partnership Accounts", fee: "-" },
    uksef: { name: "uksef", description: "UKSEF Accounts", fee: "-" },
    "group-package-400": { name: "group-package-400", description: "Group Package Accounts - Section 400, parent incorporated under UK law", fee: "-" },
    "group-package-401": { name: "group-package-401", description: "Group Package Accounts - Section 401, parent incorporated under non-UK law", fee: "-" },
    welsh: { name: "welsh", description: "Welsh Accounts with English translation", fee: "-" }
};

export function getAccountType(packageType: string): AccountType {
    return Account[packageType];
}
