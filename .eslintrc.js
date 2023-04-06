/* eslint-disable */
module.exports = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  env: {
    "es6": true
  },
  root: true,
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname,
  },
  rules: {
    semi: 'off',
    '@typescript-eslint/semi':  ['error', 'never'],
    "indent": ["error", 2],
  }
};