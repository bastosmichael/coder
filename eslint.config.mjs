import { FlatCompat } from "@eslint/eslintrc"
import tsParser from "@typescript-eslint/parser"
import { fileURLToPath } from "node:url"
import path from "node:path"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const compat = new FlatCompat({
  baseDirectory: __dirname,
  resolvePluginsRelativeTo: __dirname,
})

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
  ...compat.extends(
    "next/core-web-vitals",
    "prettier",
    "plugin:tailwindcss/recommended",
    "plugin:@typescript-eslint/recommended"
  ),
  {
    rules: {
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
    settings: {
      tailwindcss: {
        callees: ["cn", "cva"],
        config: "tailwind.config.js",
      },
    },
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        sourceType: "module",
      },
    },
  },
]

export default config
