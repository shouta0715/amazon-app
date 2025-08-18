import base from "./base.mjs";

/**
 * @param {string} cssPath
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const withConfig = (cssPath) => {
  return {
    ...base,
    plugins: ["prettier-plugin-tailwindcss"],
    tailwindStylesheet: cssPath,
  };
};

export default withConfig;
