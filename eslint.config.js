// Configuración de ESLint (flat config, ESLint 9+). Reglas explicadas en docs/standards/18-CODE-QUALITY.md.
// Inactiva hasta instalar las dependencias de desarrollo: eslint, @eslint/js y globals.
// Requiere "type": "module" en package.json. Prettier controla el formato: aquí no hay reglas de estilo.
import js from '@eslint/js';
import globals from 'globals';

const UNSAFE_HTML_SINKS = [
  {
    selector: 'AssignmentExpression[left.property.name=/^(innerHTML|outerHTML)$/]',
    message: 'Usa textContent o crea nodos con el DOM (docs/standards/12-SECURITY.md).',
  },
  {
    selector: 'CallExpression[callee.property.name=/^(insertAdjacentHTML|write|writeln)$/]',
    message: 'Inserción de HTML sin escapar prohibida (docs/standards/12-SECURITY.md).',
  },
];

export default [
  {
    ignores: [
      'node_modules/',
      'coverage/',
      'playwright-report/',
      'test-results/',
      'wireframes/',
      'frontend/vendor/',
    ],
  },
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: { ecmaVersion: 'latest', sourceType: 'module' },
    linterOptions: { reportUnusedDisableDirectives: 'error' },
    rules: {
      'no-var': 'error',
      'prefer-const': 'error',
      eqeqeq: ['error', 'always'],
      'no-console': 'error',
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-param-reassign': 'error',
      'no-shadow': 'error',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-restricted-syntax': ['error', ...UNSAFE_HTML_SINKS],
      complexity: ['warn', 10],
      'max-depth': ['warn', 4],
      'max-params': ['warn', 4],
      'max-lines-per-function': ['warn', { max: 50, skipBlankLines: true, skipComments: true }],
    },
  },
  // Navegador: páginas y módulos del frontend.
  { files: ['frontend/**/*.js'], languageOptions: { globals: globals.browser } },
  // Node.js: servidor, pruebas E2E y archivos de configuración de la raíz.
  {
    files: ['backend/**/*.js', 'e2e/**/*.js', '*.config.js'],
    languageOptions: { globals: globals.node },
  },
  // shared/ no recibe globales de entorno: debe funcionar igual en navegador y en Node.js.
  // Único punto autorizado para escribir en consola.
  { files: ['backend/src/lib/logger.js'], rules: { 'no-console': 'off' } },
  { files: ['**/*.test.js'], rules: { 'max-lines-per-function': 'off' } },
];
