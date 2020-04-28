module.exports = {
  root: true,
  parser: "babel-eslint",
  parserOptions: {
    "ecmaFeatures": {
      "jsx": true
    }
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
  overrides: [ {
    files: [ "**/*.{ts,tsx}" ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
      "ecmaFeatures": {
        "jsx": true
      },
      "tsconfigRootDir": __dirname,
      "project": [ "./tsconfig.json" ]
    },
    plugins: [ "@typescript-eslint" ],
    rules: {
      "@typescript-eslint/no-empty-function": 0,
      "@typescript-eslint/no-use-before-define": 0
    },
    extends: [
      "plugin:@typescript-eslint/eslint-recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:@typescript-eslint/recommended-requiring-type-checking"
    ]
  } ],
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "prettier",
    "prettier/react",
    "prettier/@typescript-eslint"
  ]
}
