import tsConfig from "./typescript.js";
import reactConfig from "./react.js";
import eslintPluginN from "eslint-plugin-n";
import expoPlugin from "eslint-plugin-expo";
import { defineConfig } from "eslint/config";

const config = defineConfig(...tsConfig, ...reactConfig, {
  name: "native",
  files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
  plugins: {
    "eslint-plugin-n": eslintPluginN,
    expo: expoPlugin,
  },
  rules: {
    "eslint-plugin-n/no-process-env": "error",
    "expo/no-env-var-destructuring": "error",
    "expo/no-dynamic-env-var": "error",
  },
});

export default config;
