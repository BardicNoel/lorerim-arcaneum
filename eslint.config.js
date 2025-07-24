import js from '@eslint/js'
import prettier from 'eslint-plugin-prettier'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { globalIgnores } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config([
  globalIgnores([
    'dist',
    'build',
    'node_modules',
    'coverage',
    '*.min.js',
    '*.bundle.js',
    'public',
    'vite.config.ts',
    'postcss.config.cjs',
    'tailwind.config.ts',
  ]),
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    plugins: {
      react,
      prettier,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // React rules
      'react/react-in-jsx-scope': 'off', // Not needed in React 17+
      'react/prop-types': 'off', // TypeScript handles props
      'react/jsx-uses-react': 'off', // Not needed in React 17+
      'react/jsx-uses-vars': 'error',
      'react/jsx-key': 'error',
      'react/jsx-no-duplicate-props': 'error',
      'react/jsx-no-undef': 'error',
      'react/no-unescaped-entities': 'warn',
      'react/no-unknown-property': 'error',

      // TypeScript rules - more aggressive
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error', // Changed from 'warn' to 'error' for more aggressive fixing
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/no-var-requires': 'error',

      // Prettier integration
      'prettier/prettier': 'error',

      // General rules - more aggressive auto-fixing
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-unused-vars': 'off', // Use TypeScript version instead
      'prefer-const': 'error', // Changed from 'warn' to 'error' for auto-fixing
      'no-var': 'error',
      'no-unreachable': 'error', // Auto-fixable
      'no-duplicate-imports': 'error', // Auto-fixable
      'no-useless-rename': 'error', // Auto-fixable
      'object-shorthand': 'error', // Auto-fixable
      'prefer-template': 'error', // Auto-fixable
      'prefer-arrow-callback': 'error', // Auto-fixable
      'no-empty': 'error', // Auto-fixable
      'no-extra-semi': 'error', // Auto-fixable
      'no-irregular-whitespace': 'error', // Auto-fixable
      'no-mixed-spaces-and-tabs': 'error', // Auto-fixable
    },
  },
])
