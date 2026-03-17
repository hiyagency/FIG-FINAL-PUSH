import nextVitals from "eslint-config-next/core-web-vitals";

/** @type {import("eslint").Linter.Config[]} */
const config = [
  ...nextVitals,
  {
    ignores: [
      ".next/**",
      ".reel-ai/**",
      "coverage/**",
      "node_modules/**",
      "playwright-report/**",
      "reel-ai-offline/**",
      "test-results/**"
    ]
  }
];

export default config;
