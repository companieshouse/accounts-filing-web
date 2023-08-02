export enum PACKAGE_ACCOUNTS {
    AASUBPACK1 = "AASUBPACK1",
    AASUBPACK2= "AASUBPACK2",
    UKSEF = "UKSEF",
    CIC = "CIC",
    OVERSEAS_ACCOUNTS = "OVERSEAS_ACCOUNTS",
    OVERSEAS_ACCOUNTS_WITH_OSAA01 = "OVERSEAS_ACCOUNTS_WITH_OSAA01",
    LP = "LP",
    S400_401 = "S400_401",
    WELSH = "WELSH"
}

export const PackageAccountsDescriptions: { [key in PACKAGE_ACCOUNTS]: { content: string, fee?: number} } = 
{
    [PACKAGE_ACCOUNTS.AASUBPACK1]: { content: 'Parent Accounts, Agreement and Guarantee'},
    [PACKAGE_ACCOUNTS.AASUBPACK2]: { content: 'Parent Accounts, Subsidiary Accounts, Agreement and Guarantee'},
    [PACKAGE_ACCOUNTS.UKSEF]: { content: 'UKSEF Accounts'},
    [PACKAGE_ACCOUNTS.CIC]: { content: 'Accounts and CIC 34 Report', fee: 15 },
    [PACKAGE_ACCOUNTS.OVERSEAS_ACCOUNTS_WITH_OSAA01]: { content: 'Accounts, English Translation of Accounts and OSAA01', fee: 20 },
    [PACKAGE_ACCOUNTS.OVERSEAS_ACCOUNTS]: { content: 'Accounts, English Translation of Accounts, OSAA01 is Optional', fee: 20 },
    [PACKAGE_ACCOUNTS.LP]: { content: 'General Partner Accounts (Which is a Limited Company on the Register) and LP Accounts'},
    [PACKAGE_ACCOUNTS.S400_401]: { content: 'Individual Accounts and Parent Accounts' },
    [PACKAGE_ACCOUNTS.WELSH]: { content: 'Welsh Accounts and English Translation of those Accounts' },
}