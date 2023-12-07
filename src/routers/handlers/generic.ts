// Generic handler is the base handler that is extended by all other handlers
// It contains methods that are common to multiple route handlers

import errorManifest from "../../utils/error_manifests/default";
import { Request } from "express";

export interface BaseViewData {
    errors: any
    title: string
    isSignedIn: boolean
    backURL: string | null
}

const defaultBaseViewData = {
    errors: {},
    isSignedIn: false,
};

type GenericHandlerArgs = Omit<BaseViewData, 'isSignedIn' | 'errors'>;

export abstract class GenericHandler {
    errorManifest: any;
    public baseViewData: BaseViewData;

    constructor (args: GenericHandlerArgs) {
        this.errorManifest = errorManifest;
        this.baseViewData = {
            ...defaultBaseViewData,
            ...args
        };
    }

    processHandlerException (err: any): Object {
        if (err.name === "VALIDATION_ERRORS") {
            return err.stack;
        }
        return {
            serverError: this.errorManifest.generic.serverError
        };
    }

    populateViewData(req: Request) {
        this.baseViewData.isSignedIn = req.session?.data.signin_info?.signed_in !== undefined ? true : false;
    }
}

export type HandlerReturnType = {
    templatePath?: string,
    viewData?: Record<symbol, object>,
    callbackUrl?: string
};
