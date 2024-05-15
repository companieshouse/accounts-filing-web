import { packageTypeFieldName } from "../../routers/handlers/choose_your_package_accounts/constants";

const errorManifest = {
    generic: {
        serverError: {
            summary: "There was an error processing your request. Please try again."
        }
    },
    validation: {
        default: {
            summary: "Your request contains validation errors",
            inline: "Your request contains validation errors"
        },
        email: {
            blank: {
                summary: "Enter an email address",
                inline: "Enter an email address"
            },
            incorrect: {
                summary: "Email is not valid",
                inline: "Enter an email address in the correct format, like name@example.com"
            }
        }
    },
    [packageTypeFieldName]: {
        nothingSelected: {
            summary: "Select the type of package accounts you are uploading",
            inline: ""
        }
    }
} as const;

export default errorManifest;
