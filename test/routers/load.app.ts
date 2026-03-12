export const loadApp = () => {
    jest.clearAllMocks();

    delete require.cache[require.resolve("../../src/app")];

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const app = require("../../src/app").default || require("../../src/app");

    return app;
};
