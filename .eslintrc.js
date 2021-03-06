module.exports = {
    parser: 'babel-eslint',
    parserOptions: {
        ecmaVersion: 2020,
        ecmaFeatures: {
            jsx: true
        }
    },
    plugins: ['react-hooks'],
    env: {
        browser: true,
        node: true,
        es6: true,
        jest: true
    },
    extends: [
        'omaha-prime-grade',
        'plugin:react/recommended'
    ],
    globals: {
        cy: true,
        BigInt: true
    },
    rules: {
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
        'compat/compat': 'off',
        'complexity': ['warn', 12],
        'valid-jsdoc': 'off',
        'no-magic-numbers': ['warn', {
            ignore: [-1, 0, 1, 2, 3, 10, 100]
        }]
    },
    reportUnusedDisableDirectives: true,
    settings: {
        react: {
            version: '16.8'
        }
    }
};