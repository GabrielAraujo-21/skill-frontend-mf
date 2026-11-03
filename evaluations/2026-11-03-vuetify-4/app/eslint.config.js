import pluginVue from 'eslint-plugin-vue'

export default [
  { ignores: ['dist/**', 'test-results/**', 'playwright-report/**'] },
  ...pluginVue.configs['flat/recommended'],
  {
    languageOptions: { ecmaVersion: 'latest', sourceType: 'module' },
    rules: { 'vue/max-attributes-per-line': 'off', 'vue/singleline-html-element-content-newline': 'off' },
  },
]
