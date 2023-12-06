import { logger } from "../../../utils/logger";
import { GenericHandler } from "../generic";
import { env } from "../../../config";
import { fileIdPlaceholder, uploadedUrl } from "../../../utils/constants/urls";
import { Request, Response } from "express";

export class SubmitHandler extends GenericHandler {
    SUBMIT_VALIDATION_URL: string;

    constructor () {
        super();
        this.SUBMIT_VALIDATION_URL = env.SUBMIT_VALIDATION_URL;
    }

    execute (req: Request, _res: Response): string {
        logger.info(`GET Request to send fileId call back address`);
        const zipPortalBaseURL = `${req.protocol}://${req.get('host')}`;
        const url = this.getFileUploadUrl(zipPortalBaseURL, this.SUBMIT_VALIDATION_URL);
        return url;
    }

    private getFileUploadUrl(zipPortalBaseURL: string, SUBMIT_VALIDATION_URL: string): string{
        return `${SUBMIT_VALIDATION_URL}?callback=${zipPortalBaseURL}${uploadedUrl}/${fileIdPlaceholder}`;
    }
}
