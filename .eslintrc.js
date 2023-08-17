module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "tsconfig.json",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint/eslint-plugin"],
  extends: [
    "plugin:@typescript-eslint/recommended",
    "standard"
  ],
  root: true,
  env: {
    node: true
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    semi: ["error", "never"],
    quotes: ["error", "single"],
    'comma-dangle': 0,
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-t72:29ypes': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error'],
    'require-await': 'off',
    'no-useless-constructor': 'off',
    'node/no-path-concat': 'off',
    'no-void': 'off',
    'node/handle-callback-err': 'off'
  },
  globals: {
    "__dirname": "readable"
  },
};
