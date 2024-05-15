import { PackageType } from "@companieshouse/api-sdk-node/dist/services/accounts-filing/types";
import { logger } from "../../../utils/logger";

export const fees: Record<PackageType, number> = {
    "cic": 15,
    "overseas": 33,
    uksef: 0,
    welsh: 0,
    "limited-partnership": 0,
    "group-package-400": 0,
    "group-package-401": 0,
    "audit-exempt-subsidiary": 0,
    "filing-exempt-subsidiary": 0
};

export interface PackageTypeOption {
    name: string
    description: string
    hint?: string
}

export const packageTypeOptions: PackageTypeOption[] = [
    {
        name: "cic",
        description: "Community Interest Company (CIC) accounts",
        hint: getHint(fees.cic),
    },
    {
        name: "overseas",
        description: "Overseas company accounts",
        hint: getHint(fees.overseas),
    },
    {
        name: "audit-exempt-subsidiary",
        description: "Audit exempt subsidiary accounts",
    },
    {
        name: "filing-exempt-subsidiary",
        description: "Dormant exempt subsidiary accounts",
    },
    {
        name: "limited-partnership",
        description: "Limited partnership accounts",
    },
    {
        name: "uksef",
        description: "UKSEF accounts for a listed company",
    },
    {
        name: "group-package-400",
        description:
            "Group package accounts - section 400, parent incorporated under UK law",
    },
    {
        name: "group-package-401",
        description:
            "Group package accounts - section 401, parent incorporated under non UK Law",
    },
    {
        name: "welsh",
        description: "Welsh accounts with an English translation",
    },
];

export function getPackageTypeOption(packageType: string): PackageTypeOption {
    const radioButton = packageTypeOptions.find(b => b.name === packageType);
    if (radioButton === undefined) {
        logger.error(
            `Attempted to get package type option "${packageType}" which is not valid package type.` +
                ` Must be one of ${JSON.stringify(
                    packageTypeOptions.map(b => b.name)
                )}`
        );
        throw new Error(`"${packageType}" is not a valid package type`);
    }

    return radioButton;
}

function getHint(fee: number): string  {
    return `There is a £${fee} fee to file.`;
}

export function getPackageTypeOptionsRadioButtonData() {
    return packageTypeOptions.map(option => {
        return {
            value: option.name,
            text: option.description,
            hint: option.hint === undefined ? undefined : {
                text: option.hint
            }
        };
    });
}
