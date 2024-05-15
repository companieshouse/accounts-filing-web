// Generic handler is the base handler that is extended by all other handlers
// It contains methods that are common to multiple route handlers

import { PrefixedUrls } from "../../utils/constants/urls";
import errorManifest from "../../utils/error_manifests/default";
import { Request } from "express";

export interface BaseViewData {
    errors: {
        [key: string]: any
    }
    title: string
    isSignedIn: boolean
    backURL: string | null
    Urls: typeof PrefixedUrls
}

const defaultBaseViewData = {
    errors: {},
    isSignedIn: false,
    Urls: PrefixedUrls,
};

type GenericHandlerArgs = Omit<BaseViewData, 'isSignedIn' | 'errors' | 'Urls'>;

export abstract class GenericHandler {
    errorManifest: any;
    public baseViewData: BaseViewData;

    constructor (args: GenericHandlerArgs) {
        this.errorManifest = errorManifest;
        this.baseViewData = structuredClone({
            ...defaultBaseViewData,
            ...args
        });
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

export interface ViewModel<T> {
    templatePath: string,
    viewData: T
}
