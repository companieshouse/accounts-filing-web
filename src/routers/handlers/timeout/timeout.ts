import { Request, Response } from "express";
import { SIGN_OUT } from "../../../utils/constants/urls";
import { addLangToUrl, getLocalesField, selectLang } from "../../../utils/localise";
import { BaseViewData, GenericHandler, ViewModel } from "../generic";
import { logger } from "../../../utils/logger";
import { env } from "../../../config";

export class TimeoutHandler extends GenericHandler {
    static routeViews: string = "router_views/timeout/timeout";

    constructor (req: Request) {
        super({
            title: getLocalesField("timeout_title", req),
            viewName: "timeout",
            backURL: null,
            nextURL: addLangToUrl(SIGN_OUT, selectLang(req.query.lang))
        });
    }

    execute (_req: Request, _res: Response): ViewModel<TimeoutData> {
        logger.info(`User has been taken to timeout page to be sign out`);
        // TODO sign out
        logger.debug(`Need to Sign out`);
        return { templatePath: `${TimeoutHandler.routeViews}`, viewData: {
            ...this.baseViewData,
            timeLimit: env.SESSION_TIMEOUT } };
    }
}

interface TimeoutData extends BaseViewData {
    timeLimit: number
}
