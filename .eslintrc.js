module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'import'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
  ],
  settings: {
    'import/resolver': {
      typescript: {
        // 指向根的 tsconfig.json
        project: './tsconfig.json',
      },
    },
  },
  rules: {
    // 根据需要添加或覆盖规则
  },
};
