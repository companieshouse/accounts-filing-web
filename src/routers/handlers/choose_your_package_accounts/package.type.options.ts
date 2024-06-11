import { env } from "../../../config";
import { logger } from "../../../utils/logger";

export interface PackageTypeOption {
    name: string
    description: string
    hint?: string
    disabled: boolean,
}

export const packageTypeOptions: PackageTypeOption[] = [
    {
        name: "cic",
        description: "Community Interest Company (CIC) accounts",
        hint: getHint(env.CIC_FEE),
        disabled: env.CIC_DISABLE_RADIO,

    },
    {
        name: "overseas",
        description: "Overseas company accounts",
        hint: getHint(env.OVERSEAS_FEE),
        disabled: false,
    },
    {
        name: "audit-exempt-subsidiary",
        description: "Audit exempt subsidiary accounts",
        disabled: false,
    },
    {
        name: "filing-exempt-subsidiary",
        description: "Dormant exempt subsidiary accounts",
        disabled: false,
    },
    {
        name: "limited-partnership",
        description: "Limited partnership accounts",
        disabled: false,
    },
    {
        name: "uksef",
        description: "UKSEF accounts for a listed company",
        disabled: false,
    },
    {
        name: "group-package-400",
        description:
            "Group package accounts - section 400, parent incorporated under UK law",
        disabled: false,
    },
    {
        name: "group-package-401",
        description:
            "Group package accounts - section 401, parent incorporated under non UK Law",
        disabled: false,
    },
    {
        name: "welsh",
        description: "Welsh accounts with an English translation",
        disabled: false,
    },
];

export function packageTypeOption(packageType: string): PackageTypeOption {
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

function getHint(fee: string): string  {
    return `There is a £${fee} fee to file.`;
}

export function getPackageTypeOptionsRadioButtonData() {
    return packageTypeOptions.filter(option => !option.disabled).map(option => {
        return {
            value: option.name,
            text: option.description,
            hint: option.hint === undefined ? undefined : {
                text: option.hint
            },
        };
    });
}