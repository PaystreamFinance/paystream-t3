/** @type {import("eslint").Linter.Config} */
const config = {
  parser: "@typescript-eslint/parser",
  env: {
    browser: true,
    node: true,
    es6: true,
    jest: true,
    mocha: true,
  },
  plugins: ["@typescript-eslint", "drizzle"],
  extends: [
    "next/core-web-vitals",
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    "no-unused-vars": "off",
    // "unused-imports/no-unused-imports": "error",
    // "unused-imports/no-unused-vars": [
    //   "warn",
    //   {
    //     "vars": "all",
    //     "varsIgnorePattern": "^_",
    //     "args": "after-used",
    //     "argsIgnorePattern": "^_"
    //   }
    // ],
    "@typescript-eslint/no-namespace": "off",
    strict: 0,
    "no-underscore-dangle": 0,
    "no-mixed-requires": 0,
    "no-process-exit": 0,
    "no-warning-comments": 0,
    "no-use-before-define": 0,
    curly: 0,
    "no-multi-spaces": 0,
    "no-alert": 0,
    "consistent-return": 0,
    "consistent-this": [0, "self"],
    "func-style": 0,
    "max-nested-callbacks": 0,
    camelcase: 0,
    "no-dupe-class-members": 0,

    // Warnings
    "no-debugger": 1,
    "no-empty": 1,
    "no-invalid-regexp": 1,
    "no-unused-expressions": 1,
    "no-native-reassign": 1,
    "no-fallthrough": 1,

    // Errors
    eqeqeq: ["warn"],
    // "no-undef": 2,
    "no-dupe-keys": 2,
    "no-empty-character-class": 2,
    "no-self-compare": 2,
    "valid-typeof": 2,
    "handle-callback-err": 2,
    "no-shadow-restricted-names": 2,
    "no-new-require": 2,
    "no-mixed-spaces-and-tabs": 2,
    "block-scoped-var": 2,
    "no-else-return": 2,
    "no-throw-literal": 2,
    "no-void": 2,
    radix: 2,
    "wrap-iife": [2, "outside"],
    "no-shadow": 0,
    "no-path-concat": 2,
    "valid-jsdoc": [
      0,
      {
        requireReturn: false,
        requireParamDescription: false,
        requireReturnDescription: false,
      },
    ],

    // stylistic errors
    // "no-spaced-func": 2,
    "semi-spacing": 2,
    "key-spacing": [2, { beforeColon: false, afterColon: true }],
    "no-lonely-if": 2,
    "no-floating-decimal": 2,
    "brace-style": [2, "1tbs", { allowSingleLine: true }],
    // "comma": [2, "last"],
    "no-multiple-empty-lines": [2, { max: 1 }],
    // "no-nested-ternary": 2,
    "operator-assignment": [2, "always"],
    "padded-blocks": [2, "never"],
    "quote-props": [2, "as-needed"],
    "keyword-spacing": [2, { before: true, after: true, overrides: {} }],
    "space-before-blocks": [2, "always"],
    "array-bracket-spacing": [2, "never"],
    "computed-property-spacing": [2, "never"],
    "space-in-parens": [2, "never"],
    "space-unary-ops": [2, { words: true, nonwords: false }],
    "wrap-regex": 2,
    "linebreak-style": 0,
    // "semi": [2, "always"],
    "arrow-spacing": [2, { before: true, after: true }],
    "no-class-assign": 2,
    "no-const-assign": 2,
    "no-this-before-super": 2,
    "no-var": 2,
    // "object-shorthand": [2, "always"],
    "prefer-arrow-callback": 2,
    // "prefer-const": 2,
    "prefer-spread": 2,
    // "prefer-template": 2,

    // typescript
    "@typescript-eslint/no-empty-interface": "off",
    "@typescript-eslint/no-use-before-define": ["off"],
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-this-alias": "off",
    "@typescript-eslint/no-unnecessary-type-constraint": "off",
    "@typescript-eslint/ban-types": "off",

    // ----------------------------------------------

    "@typescript-eslint/array-type": "off",
    "@typescript-eslint/consistent-type-definitions": "off",
    "@typescript-eslint/consistent-type-imports": [
      "warn",
      {
        prefer: "type-imports",
        fixStyle: "inline-type-imports",
      },
    ],
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_",
      },
    ],
    "@typescript-eslint/require-await": "off",
    // "@typescript-eslint/no-misused-promises": [
    //   "error",
    //   {
    //     checksVoidReturn: {
    //       attributes: false,
    //     },
    //   },
    // ],
    "drizzle/enforce-delete-with-where": [
      "error",
      {
        drizzleObjectName: ["db", "ctx.db"],
      },
    ],
    "drizzle/enforce-update-with-where": [
      "error",
      {
        drizzleObjectName: ["db", "ctx.db"],
      },
    ],
  },
  overrides: [
    {
      files: [
        "test/**",
        "*.spec.ts",
        "*.test.ts",
        "*.jsx",
        "*.tsx",
        "*.ts",
        "*.js",
      ],
      rules: {
        "prefer-arrow-callback": 0,
        "@typescript-eslint/no-non-null-assertion": 0,
        "@typescript-eslint/no-unused-vars": 0,
      },
    },
  ],
};
module.exports = config;
