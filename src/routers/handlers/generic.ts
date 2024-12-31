// Generic handler is the base handler that is extended by all other handlers
// It contains methods that are common to multiple route handlers

import { PrefixedUrls } from "../../utils/constants/urls";
import errorManifest from "../../utils/error_manifests/default";
import { Request, Response } from "express";
import { Optional } from "../../utils";
import { env } from "../../config";

export interface BaseViewData {
    errors: {
        [key: string]: any
    }
    title: string
    isSignedIn: boolean
    backURL: string | null
    nextURL: string | null
    viewName: string
    userEmail: string | null
    Urls: typeof PrefixedUrls
    sessionTimeout?: number
    sessionCountdown?: number
}

const defaultBaseViewData = {
    errors: {},
    isSignedIn: false,
    Urls: PrefixedUrls,
    nextURL: null,
    userEmail: null
};

type GenericHandlerArgs = Optional<Omit<BaseViewData, 'isSignedIn' | 'errors' | 'Urls' >, 'nextURL'>;

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
        this.baseViewData.sessionTimeout = env.SESSION_TIMEOUT;
        this.baseViewData.sessionCountdown = env.SESSION_COUNTDOWN;
    }
}

export interface ViewModel<T> {
    templatePath: string,
    viewData: T
}

export interface Redirect {
    url: string
}

export function isRedirect(o: any): o is Redirect {
    return o !== undefined && o !== null && typeof o === 'object' && 'url' in o && typeof o.url === 'string';
}

export function executeViewModel(res: Response, vm: ViewModel<any>) {
    res.render(vm.templatePath, vm.viewData);
}
