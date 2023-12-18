import { logger } from "../../../utils/logger";
import { GenericHandler } from "../generic";
import { env } from "../../../config";
import { fileIdPlaceholder, servicePathPrefix, uploadedUrl } from "../../../utils/constants/urls";
import { Request, Response } from "express";

export class SubmitHandler extends GenericHandler {
    constructor () {
        super({
            title: '',
            backURL: `${servicePathPrefix}`
        });
    }

    execute (req: Request, _res: Response): string {
        logger.info(`GET Request to send fileId call back address`);
        return getFileUploadUrl(req);
    }
}


export function getFileUploadUrl(req: Request): string{
    const zipPortalBaseURL = `${req.protocol}://${req.get('host')}`;
    const zipPortalCallbackUrl = zipPortalBaseURL + servicePathPrefix + uploadedUrl + `/${fileIdPlaceholder}`;

    return `${env.SUBMIT_VALIDATION_URL}?callback=${encodeURIComponent(zipPortalCallbackUrl)}`;
}
