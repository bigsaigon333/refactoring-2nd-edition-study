module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["xo", "xo-typescript", "prettier"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: "./tsconfig.json",
  },
  plugins: ["@typescript-eslint"],
  rules: {},
  ignorePatterns: "**/*.js",
};
