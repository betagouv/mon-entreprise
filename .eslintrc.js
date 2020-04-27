module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    "ecmaFeatures": {
      "jsx": true
    },
    "tsconfigRootDir": __dirname,
    "project": [ "./tsconfig.json" ]
  },
  env: {
    "browser": true,
    "commonjs": true,
    "es6": true,
  },
  globals: {
    "process": false
  },
  plugins: [
    "@typescript-eslint",
    "react",
    "react-hooks"
  ],
  rules: {
    "quotes": [
      1,
      "single",
      {
        "avoidEscape": true
      }
    ],
    "no-console": 1,
    "no-restricted-globals": [
      2,
      "length"
    ],
    "no-global-assign": 0,
    "no-unsafe-negation": 0,
    "react/prop-types": 0,
    "react/jsx-no-target-blank": 0,
    "react/no-unescaped-entities": 0,
    "react/display-name": 1,
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  },
  settings: {
    "react": {
      "version": "detect"
    }
  },
  overrides: [
    {
      "files": [
        "*.test.js",
        "cypress/integration/**/*.js"
      ]
    }
  ],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:react/recommended",
    "prettier",
    "prettier/react",
    "prettier/@typescript-eslint"
  ]
}
