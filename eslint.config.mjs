import tseslint from "typescript-eslint";

const eslintConfig = tseslint.config(
  ...tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
    },
  },
  {
    ignores: [".react-router/**", "build/**", "node_modules/**", "functions/lib/**"],
  }
);

export default eslintConfig;
