module.exports = {
  root: true,
  extends: '@react-native',
  overrides: [
    {
      files: ["*.js", "*.jsx", "*.ts", "*.tsx"],
      rules: {
        "prettier/prettier": 0,
        "@typescript-eslint/no-shadow": ["error"],
        "no-shadow": "off",
        "no-undef": "off",
        "quotes": "off",
        "@typescript-eslint/no-unused-vars": ["warn"],
      },
    },
  ],
};
