module.exports = {
  'env': {
    'browser': true,
    'es2021': true,
  },
  'extends': [
    'google',
  ],
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'ecmaVersion': 12,
    'sourceType': 'module',
  },
  'plugins': [
    '@typescript-eslint',
  ],
  'ignorePatterns': ['tests/', 'node_modules/', 'dist/', 'assets/'],
  'rules': {
    'valid-jsdoc': 1,
    'no-invalid-this': 1,
    'require-jsdoc': 0,
    'max-len': [1, 120, 2],
    'object-curly-spacing': [
      'error',
      'always',
    ],
  },
};
