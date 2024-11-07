import { getLocalesField } from "../../../utils/localise";
import { env } from "../../../config";
import { logger } from "../../../utils/logger";
import { Request } from "express";

export interface PackageTypeOption {
    name: string
    description: string
    hint?: string
    disabled: boolean,
}

export const packageTypeOptions = (req: Request): PackageTypeOption[] => [
    {
        name: "cic",
        description: getLocalesField("community_interest_company_accounts_description", req),
        hint: getHint(getLocalesField("choose_your_package_accounts_fee_text", req), env.CIC_FEE),
        disabled: env.CIC_DISABLE_RADIO,

    },
    {
        name: "overseas",
        description: getLocalesField("overseas_company_accounts_description", req),
        hint: getHint(getLocalesField("choose_your_package_accounts_fee_text", req), env.OVERSEAS_FEE),
        disabled: env.DISABLE_OVERSEAS_COMPANY_ACCOUNTS_RADIO,
    },
    {
        name: "audit-exempt-subsidiary",
        description: getLocalesField("audit_exempt_subsidiary_accounts_description", req),
        disabled: env.DISABLE_AUDIT_EXEMPT_SUBSIDIARY_ACCOUNTS_RADIO,
    },
    {
        name: "filing-exempt-subsidiary",
        description: getLocalesField("dormant_exempt_subsidiary_accounts_description", req),
        disabled: env.DISABLE_DORMANT_EXEMPT_SUBSIDIARY_ACCOUNTS_RADIO,
    },
    {
        name: "limited-partnership",
        description: getLocalesField("limited_partnership_accounts_description", req),
        disabled: env.DISABLE_LIMITED_PARTNERSHIP_ACCOUNTS_RADIO,
    },
    {
        name: "uksef",
        description: getLocalesField("uksef_accounts_for_listed_company_description", req),
        disabled: false,
    },
    {
        name: "group-package-400",
        description: getLocalesField("group_package_accounts_400_description", req),
        disabled: env.DISABLE_GROUP_SECTION_400_UK_PARENT_ACCOUNTS_RADIO,
    },
    {
        name: "group-package-401",
        description: getLocalesField("group_package_accounts_401_description", req),
        disabled: env.DISABLE_GROUP_SECTION_401_NON_UK_PARENT_ACCOUNTS_RADIO,
    },
    {
        name: "welsh",
        description: getLocalesField("welsh_accounts_description", req),
        disabled: false,
    },
];

export function packageTypeOption(packageType: string, req: Request): PackageTypeOption {
    const radioButton = packageTypeOptions(req).find(b => b.name === packageType);
    if (radioButton === undefined) {
        logger.error(
            `Attempted to get package type option "${packageType}" which is not valid package type.` +
                ` Must be one of ${JSON.stringify(
                    packageTypeOptions(req).map(b => b.name)
                )}`
        );
        throw new Error(`"${packageType}" is not a valid package type`);
    }

    return radioButton;
}

function getHint(hint: string, fee: string): string  {
    return hint.replace("<fee>", fee);
}

export function getPackageTypeOptionsRadioButtonData(req: Request) {
    return packageTypeOptions(req).filter(option => !option.disabled).map(option => {
        const dashDescription = option.description.split(/\W+/).join('-');
        return {
            value: option.name,
            text: option.description,
            hint: option.hint === undefined ? undefined : {
                text: option.hint
            },
            attributes: {
                "data-event-id": "package-accounts-choose-your-accounts-" + dashDescription + "-radio-button"
            }
        };
    });
}
