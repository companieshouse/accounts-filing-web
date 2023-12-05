export default () => {
    process.env.CHS_URL = "http://chs.local";
    process.env.NUNJUCKS_LOADER_WATCH = "false";
    process.env.CACHE_SERVER = "cache_server";
    process.env.CDN_HOST = "http://chs.local";
    process.env.COOKIE_DOMAIN = "cookie_domain";
    process.env.COOKIE_NAME = "cookie_name";
    process.env.COOKIE_SECRET = "123456789012345678901234";
    process.env.SUBMIT_VALIDATION_URL = "http://chs.locl/xbrl_validate/submit";
};
