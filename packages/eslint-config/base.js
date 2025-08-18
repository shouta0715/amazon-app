import tseslint from "typescript-eslint";
import turbo from "eslint-plugin-turbo";
import eslintConfigPrettier from "eslint-config-prettier/flat";

const config = tseslint.config(
  {
    name: "settings",
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    settings: {
      "import/resolver": {
        typescript: {
          project: "./tsconfig.json",
        },
      },
    },
  },
  {
    name: "global-plugins",
    plugins: {
      turbo,
    },
  },
  {
    name: "ignores",
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/public/**",
      "**/.next/**",
      "**/.turbo/**",
    ],
  },
  {
    name: "prettier",
    ...eslintConfigPrettier,
  }
);

export default config;
