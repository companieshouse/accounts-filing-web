
import type { Express } from "express";
import request, { Response } from "supertest";
import { setCookie } from "../../routers/helper/requests";
import { synchronously_import_module } from "./itest_mocks";

export class ITestPageRequester {

    private readonly app: Express;
    private readonly page_url: string;

    constructor(page_url: string, set_state: () => void) {
        this.app = this.loadAppWithSetup(set_state);
        this.page_url = page_url;
    }

    private loadAppWithSetup(setup?: () => void) {
        let app: any;

        jest.isolateModules(() => {
            setup?.();
            const appModule = synchronously_import_module("../../../src/app");
            app = appModule.default ?? appModule;
        });

        return app;
    }

    public async get(): Promise<Response> {
        return request(this.app).get(this.page_url).set("Cookie", setCookie());
    }

    public async post(): Promise<Response> {
        return request(this.app).post(this.page_url).set("Cookie", setCookie());
    }

    public async post_form(form_data: object = {}): Promise<Response> {
        return request(this.app).post(this.page_url).set("Cookie", setCookie()).type('form').send(form_data);
    }
}
