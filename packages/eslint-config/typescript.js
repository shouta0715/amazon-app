import tseslint from "typescript-eslint";
import eslint from "@eslint/js";
import baseConfig from "./base.js";
import unusedImports from "eslint-plugin-unused-imports";
import importPlugin from "eslint-plugin-import";
import eslintPluginUnicorn from "eslint-plugin-unicorn";

const config = tseslint.config(
  ...baseConfig,
  {
    name: "typescript-logic",
    files: ["**/*.ts", "**/*.tsx"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.strict,
      importPlugin.flatConfigs.recommended,
      importPlugin.flatConfigs.typescript,
    ],
    plugins: {
      "unused-imports": unusedImports,
      unicorn: eslintPluginUnicorn,
    },
    rules: {
      "unused-imports/no-unused-imports": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/restrict-plus-operands": "error",
      "@typescript-eslint/switch-exhaustiveness-check": "error",
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "import/no-unresolved": ["error", { ignore: ["^geist"] }],
      "no-void": ["error", { allowAsStatement: true }],
      "import/no-extraneous-dependencies": [
        "error",
        {
          devDependencies: [
            "**/*.test.ts",
            "**/*.test.tsx",
            "**/*.stories.tsx",
            "**/*.stories.ts",
            "**/*.config.ts",
            "**/*.config.mjs",
          ],
        },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          vars: "all",
          args: "after-used",
          argsIgnorePattern: "_",
          ignoreRestSiblings: false,
          varsIgnorePattern: "_",
        },
      ],
      "no-restricted-syntax": [
        "error",
        {
          selector: "ForInStatement",
          message: "Use Object.entries() instead.",
        },
        {
          selector: "TSEnumDeclaration",
          message: "Use type instead.",
        },
        {
          selector: "WithStatement",
        },
      ],
      "unicorn/prefer-switch": [
        "error",
        { emptyDefaultCase: "no-default-case" },
      ],
    },
  },
  {
    name: "typescript-style",
    files: ["**/*.ts", "**/*.tsx"],
    extends: [...tseslint.configs.stylistic],
    rules: {
      "prefer-template": "error",
      "no-console": ["error", { allow: ["warn", "error", "info", "debug"] }],
      "arrow-body-style": ["error", "as-needed"],
      "padding-line-between-statements": [
        "error",
        {
          blankLine: "always",
          prev: "*",
          next: "return",
        },
      ],
      "import/order": [
        "error",
        {
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
      "import/extensions": [
        "error",
        "ignorePackages",
        {
          ts: "never",
          tsx: "never",
          js: "never",
          jsx: "never",
        },
      ],
    },
  }
);

export default config;
