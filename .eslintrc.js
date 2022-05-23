module.exports = {
  root: true,
  extends: ['@kbn/eslint-config', 'plugin:@elastic/eui/recommended', 'prettier'],
  rules: {
    '@kbn/eslint/require-license-header': 'off',
    quotes: 'single',
    'no-console': 1, // Means warning
    'prettier/prettier': 2, // Means error
  },
  plugins: ['prettier'],
};
