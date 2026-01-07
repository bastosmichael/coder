import next from "@next/eslint-plugin-next"
import tsPlugin from "@typescript-eslint/eslint-plugin"
import tsParser from "@typescript-eslint/parser"
import importPlugin from "eslint-plugin-import"
import jsxA11y from "eslint-plugin-jsx-a11y"
import react from "eslint-plugin-react"
import reactHooks from "eslint-plugin-react-hooks"
import tailwindcss from "eslint-plugin-tailwindcss"
import prettier from "eslint-config-prettier"

const nextRules = {
  ...next.configs.recommended.rules,
  ...next.configs["core-web-vitals"].rules,
}

const importRules = importPlugin.configs.recommended.rules
const jsxA11yRules = jsxA11y.configs.recommended.rules
const reactRules = react.configs.recommended.rules
const reactHooksRules = reactHooks.configs.recommended.rules
const tailwindRules = tailwindcss.configs.recommended.rules
const tsRules = tsPlugin.configs.recommended.rules
const prettierRules = prettier.rules

const config = [
  {
    ignores: [
      "__tests__/**",
      "coverage/**",
      "db/**",
      "types/**",
      "jest.config.js",
      "jest.setup.ts",
      "tailwind.config.ts",
      "drizzle.config.ts",
      "next.config.mjs",
      "postcss.config.mjs",
    ],
  },
  {
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        sourceType: "module",
      },
    },
    plugins: {
      "@next/next": next,
      "@typescript-eslint": tsPlugin,
      import: importPlugin,
      "jsx-a11y": jsxA11y,
      react,
      "react-hooks": reactHooks,
      tailwindcss,
    },
    settings: {
      react: {
        version: "detect",
      },
      "import/resolver": {
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
        typescript: {
          alwaysTryTypes: true,
        },
      },
      tailwindcss: {
        callees: ["cn", "cva"],
        config: "tailwind.config.js",
      },
    },
    rules: {
      ...importRules,
      ...jsxA11yRules,
      ...reactRules,
      ...reactHooksRules,
      ...tailwindRules,
      ...tsRules,
      ...nextRules,
      ...prettierRules,
      "@next/next/no-img-element": "off",
      "jsx-a11y/alt-text": "off",
      "react-hooks/exhaustive-deps": "off",
      "tailwindcss/enforces-negative-arbitrary-values": "off",
      "tailwindcss/no-contradicting-classname": "off",
      "tailwindcss/no-custom-classname": "off",
      "react/no-unescaped-entities": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
]

export default config
