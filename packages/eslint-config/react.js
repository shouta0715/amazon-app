import tseslint from "typescript-eslint";
import tsConfig from "./typescript.js";
import reactPlugin from "eslint-plugin-react";
import globals from "globals";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";

const config = tseslint.config(
  ...tsConfig,
  {
    name: "react-settings",
    files: ["**/*.ts", "**/*.tsx"],
    ...reactPlugin.configs.flat.recommended,
    ...jsxA11y.flatConfigs.strict,
    settings: { react: { version: "detect" } },
    languageOptions: {
      ...reactPlugin.configs.flat.recommended.languageOptions,
      ...jsxA11y.flatConfigs.recommended.languageOptions,
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
      },
    },
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "jsx-a11y": jsxA11y,
    },
  },
  {
    name: "react-rules",
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      ...reactHooksPlugin.configs.recommended.rules,
      "react/require-default-props": "off",
      "react/react-in-jsx-scope": "off",
      "react/jsx-props-no-spreading": "off",
      "react/jsx-no-bind": "off",
      "react/prop-types": "off",
      "react/no-unknown-property": "error",
      "react-hooks/exhaustive-deps": "error",
      "react/jsx-curly-brace-presence": ["error", "never"],
      "react/jsx-sort-props": [
        "error",
        {
          callbacksLast: true,
          shorthandFirst: true,
          noSortAlphabetically: false,
          reservedFirst: true,
        },
      ],
      "react/self-closing-comp": "error",
      "react/jsx-boolean-value": ["error", "never"],
      "react/jsx-filename-extension": [
        "error",
        {
          extensions: [".jsx", ".tsx"],
        },
      ],
    },
  }
);

export default config;
