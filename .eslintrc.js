module.exports = {
  'env': {
    'browser': true,
    'commonjs': true,
    'es2021': true,
  },
  'extends': [
    'google',
  ],
  'parserOptions': {
    'ecmaVersion': 12,
  },
  'ignorePatterns': ['client/', 'node_modules/'],
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
