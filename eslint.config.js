import js from "@eslint/js";
import globals from "globals";
import playwright from "eslint-plugin-playwright";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist", "playwright-report", "test-results"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
  {
    ...playwright.configs["flat/recommended"],
    files: ["playwright/**/*.ts"],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      ...playwright.configs["flat/recommended"].rules,
      "react-hooks/rules-of-hooks": "off",
      "react-refresh/only-export-components": "off",
      "@typescript-eslint/no-unused-vars": "error",
      "playwright/expect-expect": ["error", { assertFunctionPatterns: ["^expect[A-Z]\\w*$"] }],
    },
  },
);
