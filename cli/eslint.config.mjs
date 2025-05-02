import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import { createNextImportResolver } from "eslint-import-resolver-next";
import nodePlugin from "eslint-plugin-n";

import globals from "globals";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import eslintPluginImportX from "eslint-plugin-import-x";

export default defineConfig({
  files: ["L10nImages/**/*.{js,mjs,cjs}"],
  extends: [
    js.configs.recommended,
    eslintPluginImportX.flatConfigs.recommended,
    eslintPluginImportX.flatConfigs.typescript,
    nodePlugin.configs["flat/recommended-module"],
    eslintConfigPrettier,
  ],
  languageOptions: {
    globals: globals.node,
    sourceType: "module",
  },
  settings: {
    "import-x/resolver-next": [createNextImportResolver({})],
  },
  rules: {
    "n/no-process-exit": "off",
    "n/prefer-node-protocol": ["error"],
    "n/file-extension-in-import": ["error"],
    "import-x/no-dynamic-require": "warn",
    "import-x/no-commonjs": ["error"],
    "import-x/newline-after-import": ["error", { count: 1 }],
    "import-x/order": [
      "error",
      {
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
      },
    ],
  },
});
