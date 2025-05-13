import js from "@eslint/js";
import json from "@eslint/json";
import markdown from "@eslint/markdown";
import htmlmarkup from "@html-eslint/eslint-plugin";
import * as htmlParser from "@html-eslint/parser";
import * as tsParser from "@typescript-eslint/parser";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import { createTypeScriptImportResolver } from "eslint-import-resolver-typescript";
import html from "eslint-plugin-html";
import eslintPluginImportX from "eslint-plugin-import-x";
import nodePlugin from "eslint-plugin-n";
import globals from "globals";
import tseslint from "typescript-eslint";

const importOrderConfig = {
  groups: [
    // Imports of builtins are first
    "builtin",
    "external",

    // Then sibling and parent imports. They can be mingled together
    ["sibling", "parent"],
    // Then index file imports
    "index",
    // Then any arcane TypeScript imports
    "object",
    // Then the omitted imports: internal, type, unknown
    "type",
  ],
  alphabetize: { order: "asc" },
  sortTypesGroup: true,
  "newlines-between": "always",
};

export default tseslint.config(
  // Markdown files
  {
    files: ["**/*.md"],
    plugins: {
      markdown,
    },
    extends: [...markdown.configs.recommended, eslintConfigPrettier],
  },
  // HTML files (excludes EJS templates with .html extension)
  {
    files: ["**/*.html"],
    ignores: ["**/_*.html"],
    plugins: { html, "@html-eslint": htmlmarkup },
    languageOptions: { parser: htmlParser },
    ...htmlmarkup.configs["flat/recommended"],
    settings: {
      "html/indent": "+4",
      "html/report-bad-indent": "error",
    },
    rules: {
      "@html-eslint/attrs-newline": [
        "error",
        {
          ifAttrsMoreThan: 3,
        },
      ],
    },
  },
  // JSON files
  {
    files: ["**/*.json"],
    language: "json/json",
    plugins: {
      json,
    },
    extends: [json.configs.recommended, eslintConfigPrettier],
  },
  // Source files (TypeScript)
  {
    files: ["src/**/*.ts"],
    extends: [
      js.configs.recommended,
      eslintPluginImportX.flatConfigs.recommended,
      eslintPluginImportX.flatConfigs.typescript,
      ...tseslint.configs.recommended,
      eslintConfigPrettier,
    ],
    languageOptions: {
      ecmaVersion: "latest",
      globals: globals.browser,
      parser: tsParser,
      sourceType: "module",
    },
    settings: {
      "import-x/resolver-next": [
        createTypeScriptImportResolver({
          alwaysTryTypes: true,
          project: "tsconfig.json",
        }),
      ],
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "import-x/no-dynamic-require": "warn",
      "import-x/no-nodejs-modules": "warn",
      "import-x/newline-after-import": ["error", { count: 1 }],
      "import-x/order": ["error", importOrderConfig],
    },
  },
  // Configuration files (Webpack, ESLint, etc.)
  {
    files: ["*.{js,mjs}"],
    extends: [
      js.configs.recommended,
      eslintPluginImportX.flatConfigs.recommended,
      nodePlugin.configs["flat/recommended-module"],
      eslintConfigPrettier,
    ],
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        ecmaVersion: 2025,
        sourceType: "module",
      },
    },
    settings: {
      "import-x/resolver-next": [
        createTypeScriptImportResolver({
          alwaysTryTypes: true,
          project: "tsconfig.json",
        }),
      ],
    },
    rules: {
      "n/no-process-exit": "off",
      "n/prefer-node-protocol": ["error"],
      "n/file-extension-in-import": ["error"],
      "import-x/no-dynamic-require": "warn",
      "import-x/no-commonjs": ["off"],
      "import-x/newline-after-import": ["error", { count: 1 }],
      "import-x/order": ["error", importOrderConfig],
    },
  },
);
