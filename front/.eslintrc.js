module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: ["naver", "plugin:react-hooks/recommended"],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 'latest',
    },
    plugins: [
        'react',
        '@typescript-eslint',
    ],
    rules: {
        "linebreak-style": 0,
        'no-console': 'off',
    },
};
