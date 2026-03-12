import { defineConfig } from 'eslint/config';
import stylisticTs from '@stylistic/eslint-plugin';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import globals from "globals";

const normalize = (cfg) => {
    if (cfg === undefined || cfg === null) return [];
    return Array.isArray(cfg) ? cfg : [cfg];
};

const basePluginRegistration = {
    plugins: {
        '@typescript-eslint': typescriptEslint,
        '@stylistic/ts': stylisticTs,
    },
    languageOptions: {
        globals: {
        ...globals.node,
        ...globals.jest,
        },
        parser: typescriptEslint.parser,
        parserOptions: {
            ecmaVersion: 11,
            sourceType: 'module',
        },
    },
};

export default defineConfig([
    // register plugin & parser first so subsequent spreads can reference them
    basePluginRegistration,

    ...normalize(typescriptEslint.configs['flat/eslint-recommended']),
    ...normalize(typescriptEslint.configs['flat/recommended']),
    ...normalize(typescriptEslint.configs['flat/recommended-requiring-type-checking']),

    {
        ignores: ['views/', 'node_modules/'],
        rules: {
            '@typescript-eslint/ban-types': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-inferrable-types': 'off',
            '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
            'semi': ['error', 'always'],
            '@stylistic/ts/type-annotation-spacing': 'error',
            'arrow-spacing': 'error',
            'brace-style': ['error', '1tbs', { allowSingleLine: true }],
            'comma-spacing': ['error', { before: false, after: true }],
            curly: 'error',
            eqeqeq: 'error',
            'eol-last': ['warn', 'always'],
            indent: ['error', 4, { FunctionExpression: { parameters: 'first' }, CallExpression: { arguments: 'first' }, outerIIFEBody: 2, SwitchCase: 2 }],
            'key-spacing': ['error', { afterColon: true }],
            'keyword-spacing': ['error', { before: true, after: true }],
            'no-irregular-whitespace': 'error',
            'no-trailing-spaces': 'error',
            'no-underscore-dangle': ['error', { allowFunctionParams: true }],
            'no-unused-vars': 'off',
            'no-whitespace-before-property': 'error',
            'object-curly-spacing': ['error', 'always'],
            'space-infix-ops': 'error',
            'spaced-comment': ['error', 'always', { markers: ['/', '*'] }],
        },
    },
]);
