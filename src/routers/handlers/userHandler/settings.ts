import { Request, Response } from "express";
import { GenericHandler } from "./../generic";
import logger from "../../../lib/logger";

export class SettingsHandler extends GenericHandler {

    constructor () {
        super();
        this.viewData.title = "Settings handler for user route";
        this.viewData.sampleKey = "sample value for user settings screen";
    }

    async execute (req: Request, response: Response, method: string = "GET"): Promise<Object> {
        logger.info(`${method} request for user settings`);
        // ...process request here and return data for the view
        return this.viewData;
    }
};