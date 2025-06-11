{
  "env": {
    "browser": true,
    "es2022": true
  },
  "extends": [
    "eslint:recommended"
  ],
  "parserOptions": {
    "ecmaVersion": 2022,
    "sourceType": "script"
  },
  "globals": {
    "globalThis": "readonly"
  },
  "rules": {
    "no-console": "off",
    "no-unused-vars": "warn",
    "no-undef": "error",
    "prefer-const": "warn",
    "no-var": "error"
  },
  "ignorePatterns": [
    "dist/**",
    "node_modules/**"
  ]
} 