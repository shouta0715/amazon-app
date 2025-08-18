import tseslint from "typescript-eslint";
import tsConfig from "./typescript.js";
import reactConfig from "./react.js";
import nextPlugin from "@next/eslint-plugin-next";
import eslintPluginN from "eslint-plugin-n";

const config = tseslint.config(...tsConfig, ...reactConfig, {
  name: "next",
  files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
  plugins: {
    "@next/next": nextPlugin,
    "eslint-plugin-n": eslintPluginN,
  },
  rules: {
    ...nextPlugin.configs.recommended.rules,
    ...nextPlugin.configs["core-web-vitals"].rules,
    "@next/next/no-img-element": "error",
    "eslint-plugin-n/no-process-env": "error",
    "@next/next/no-async-client-component": "error",
    "no-restricted-imports": [
      "error",
      {
        name: "next/router",
        message: "Please import from `next/navigation` instead.",
      },
    ],
  },
});

export default config;
