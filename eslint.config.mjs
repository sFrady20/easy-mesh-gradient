import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

// Covers lib and pages; promo has its own Remotion flat config
export default tseslint.config(
  {
    ignores: ["**/dist/**", "**/node_modules/**", "promo/**", "**/*.d.ts"],
  },
  tseslint.configs.recommended,
  {
    files: ["pages/src/**/*.{ts,tsx}"],
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs["recommended-latest"].rules,
      "react-refresh/only-export-components": "warn",
    },
  }
);
