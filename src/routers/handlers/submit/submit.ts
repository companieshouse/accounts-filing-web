import { logger } from "../../../utils/logger";
import { GenericHandler } from "../generic";
import { env } from "../../../config";
import { fileIdPlaceholder, servicePathPrefix, uploadedUrl } from "../../../utils/constants/urls";
import { Request, Response } from "express";

export class SubmitHandler extends GenericHandler {
    SUBMIT_VALIDATION_URL: string;

    constructor () {
        super({
            title: '',
            backURL: `${servicePathPrefix}`
        });

        this.SUBMIT_VALIDATION_URL = env.SUBMIT_VALIDATION_URL;
    }

    execute (req: Request, _res: Response): string {
        logger.info(`GET Request to send fileId call back address`);
        const zipPortalBaseURL = `${req.protocol}://${req.get('host')}`;
        return this.getFileUploadUrl(zipPortalBaseURL, this.SUBMIT_VALIDATION_URL);
    }

    private getFileUploadUrl(zipPortalBaseURL: string, SUBMIT_VALIDATION_URL: string): string{
        const zipPortalCallbackUrl = zipPortalBaseURL + servicePathPrefix + uploadedUrl + `/${fileIdPlaceholder}`;

        return `${SUBMIT_VALIDATION_URL}?callback=${encodeURIComponent(zipPortalCallbackUrl)}`;
    }
}
