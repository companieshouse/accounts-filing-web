import { env } from "../../config";

type PackageType = Record< "name" | "description" | "fee", string | string |string>;

type PackageTypes = Record<string, PackageType>;

const PackageTypeDetails: PackageTypes =  {
    cic: { name: "cic", description: "Community Interest Company (CIC) accounts", fee: env.CIC_FEE },
    overseas: { name: "overseas", description: "Overseas company accounts", fee: env.OVERSEAS_FEE },
    "audit-exempt-subsidiary": { name: "audit-exempt-subsidiary", description: "Audit exempt subsidiary accounts", fee: "-" },
    "filing-exempt-subsidiary": { name: "filing-exempt-subsidiary", description: "Dormant exempt subsidiary accounts", fee: "-" },
    "limited-partnership": { name: "limited-partnership", description: "Limited partnership accounts", fee: "-" },
    uksef: { name: "uksef", description: "UKSEF accounts for a listed company", fee: "-" },
    "group-package-400": { name: "group-package-400", description: "Group package accounts - section 400, parent incorporated under UK law", fee: "-" },
    "group-package-401": { name: "group-package-401", description: "Group package accounts - section 401, parent incorporated under non UK Law", fee: "-" },
    welsh: { name: "welsh", description: "Welsh accounts with an English translation", fee: "-" }
};

function getDetailsForPackageType(packageType: string): PackageType {
    return PackageTypeDetails[packageType];
}

type PackageAccountsType = Record<string, string | Record<string, string | null>>;
const packageItems: Array<PackageAccountsType> = [];

Object.entries(PackageTypeDetails).forEach(
    ([key, value]) => {
        const hintText = value.fee === "-" ? null : `There is a £${value.fee} fee to file.`;

        packageItems.push(
            {
                value: key,
                text: value.description,
                hint: {
                    text: hintText
                }
            }
        );
    }
);

const getPackageItems = () => packageItems;

export { getPackageItems, getDetailsForPackageType, PackageTypeDetails, PackageAccountsType };
