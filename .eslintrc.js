module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['tsconfig.json', './tsconfig.spec.json'],
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'import'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: [
    '.eslintrc.js',
    'node_modules/',
    'dist/',
    'coverage/'
  ],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    "@typescript-eslint/no-unused-vars": ["error", {
      "argsIgnorePattern": "^_",
      "varsIgnorePattern": "^_"
    }],
    'import/order': [
      'error',
      {
        groups: [
          'builtin', // Node.js модули
          'external', // Внешние модули
          'internal', // Внутренние модули
          ['parent', 'sibling', 'index'], // Относительные пути
        ],
        'newlines-between': 'always', // Разделение групп пустой строкой
        alphabetize: { order: 'asc', caseInsensitive: true }, // Сортировка по алфавиту
      },
    ],
    'max-len': ['error', {
      code: 120,
      ignoreComments: true,
      ignoreUrls: true,
    }],
    'no-tabs': 'off',
    'no-mixed-spaces-and-tabs': ['error', 'smart-tabs'],
    'prettier/prettier': ['off', {
      chains: 'none',
      bracketChain: false,
      operatorChainBreak: false
    }],
  },
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: ['tsconfig.json', './tsconfig.spec.json'],
      },
    },
  },
};

