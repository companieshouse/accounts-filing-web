export type PaymentType = Record<string, Record< "name" | "description" | "fee", string | string |string>>;

export const AccountType: PaymentType =  {
    "CIC": { name: "CIC", description: "Community Interest Companies", fee: "£15" },
    "OC": { name: "OC", description: "Overseas Companies", fee: "£33" },
    "AE": { name: "AE", description: "Audit Exempt Subsidiary Accounts", fee: "-" },
    "DE": { name: "DE", description: "Dormant Exempt Subsidiary Accounts", fee: "-" },
    "LPA": { name: "LPA", description: "Limited Partnership Accounts", fee: "-" },
    "UKSEF": { name: "UKSEF", description: "UKSEF Accounts", fee: "-" },
    "Group400": { name: "Group400", description: "Group Package Accounts - Section 400, parent incorporated under UK law", fee: "-" },
    "Group401": { name: "Group401", description: "Group Package Accounts - Section 401, parent incorporated under non-UK law", fee: "-" },
    "Welsh": { name: "Welsh", description: "Welsh Accounts with English translation", fee: "-" }
};

export function getPayment(paymentTypeName: string | Error): string {
    if (typeof paymentTypeName !== "string"){
        throw new Error("Account type must be correctly defined");
    }

    if (Object.keys(AccountType).includes(paymentTypeName)){
        return AccountType[paymentTypeName].fee;
    } else { throw new Error(`Account ${paymentTypeName} is not handled at the moment`);}
}

