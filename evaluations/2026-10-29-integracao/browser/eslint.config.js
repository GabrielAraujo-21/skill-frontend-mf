export default [{
  ignores: ['node_modules/**', 'evidencias/**', 'test-results/**'],
}, {
  files: ['*.js', 'tests/**/*.js'],
  languageOptions: {
    ecmaVersion: 'latest', sourceType: 'module',
    globals: { process: 'readonly', document: 'readonly', fetch: 'readonly', window: 'readonly', requestAnimationFrame: 'readonly' },
  },
  rules: { 'no-unused-vars': 'error', 'no-undef': 'error', 'no-unreachable': 'error', 'no-constant-condition': 'error' },
}];
