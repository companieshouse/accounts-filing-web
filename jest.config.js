module.exports = {
    roots: ["<rootDir>"],
    testPathIgnorePatterns: ["/node_modules/", "/dist/"],
    collectCoverageFrom: ["./src/**/*.ts"],
    coveragePathIgnorePatterns: ["/src/bin/"],
    preset: "ts-jest",
    testEnvironment: "node",
    verbose: true,
    testMatch: ["**/test/**/*.unit.[jt]s"],
    globals: {
        "ts-jest": {
            diagnostics: false,
        },
    },
    globalSetup: "./test/global.setup.ts",
};
