import app from "../../../src/app";
import { env } from "../../../src/config";
import request from "supertest";

export const setCookie = () => {
    return [env.COOKIE_NAME + '=' + env.COOKIE_SECRET];
};

export const getRequestWithCookie = (uri: string, agent = app) => {
    return request.agent(agent).set("Cookie", setCookie()).get(uri);
};
