module.exports = {
	root: true,
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 'latest',
		ecmaFeatures: {
			jsx: true,
		},
	},
	env: {
		browser: true,
		commonjs: true,
		es6: true,
	},
	globals: {
		process: false,
	},
	plugins: ['react', 'react-hooks', 'mocha'],
	rules: {
		quotes: [
			1,
			'single',
			{
				avoidEscape: true,
			},
		],
		'no-console': 1,
		'no-restricted-globals': [2, 'length'],
		'no-global-assign': 0,
		'no-unsafe-negation': 0,
		'react/prop-types': 0,
		'react/jsx-no-target-blank': 0,
		'react/no-unescaped-entities': 0,
		'react/display-name': 1,
		'react-hooks/rules-of-hooks': 'error',
		'react-hooks/exhaustive-deps': 'warn',
		'react/jsx-uses-react': 'off',
		'react/react-in-jsx-scope': 'off',
		'mocha/no-skipped-tests': 'warn',
		'mocha/no-exclusive-tests': 'error',
		'no-restricted-syntax': [
			'error',
			{
				message:
					'Utilisez le composant <Emoji /> plutôt que la function emoji directement importée de react-easy-emoji',
				selector: "CallExpression[callee.name='emoji']",
			},
		],
	},
	settings: {
		react: {
			version: 'detect',
		},
	},
	overrides: [
		{
			files: ['**/*.{ts,tsx}'],
			parser: '@typescript-eslint/parser',
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
				// eslint-disable-next-line no-undef
				tsconfigRootDir: __dirname,
				project: ['./site/tsconfig.json'],
			},
			plugins: ['@typescript-eslint'],
			rules: {
				'@typescript-eslint/no-empty-interface': 0,
				'@typescript-eslint/no-empty-function': 0,
				'@typescript-eslint/no-use-before-define': 0,
				'@typescript-eslint/member-delimiter-style': [
					2,
					{
						multiline: {
							delimiter: 'none',
						},
					},
				],
				'@typescript-eslint/explicit-function-return-type': 0,
				'@typescript-eslint/prefer-string-starts-ends-with': 1,
				'@typescript-eslint/no-unnecessary-type-assertion': 1, // has false positives (Object.values result) v 2.29.0
				'@typescript-eslint/no-inferrable-types': 1, // causes problems with unknown values v 2.29.0 typescript v 3.8.3
				'@typescript-eslint/no-var-requires': 'off',
				// TODO - enable these new recommended rules, a first step would be to switch from "off" to "warn"
				'@typescript-eslint/explicit-module-boundary-types': 'off',
				'@typescript-eslint/no-floating-promises': 'off',
				'@typescript-eslint/no-extra-semi': 'off',
				'@typescript-eslint/no-unsafe-assignment': 'off',
				'@typescript-eslint/no-unsafe-call': 'off',
				'@typescript-eslint/no-unsafe-member-access': 'off',
				'@typescript-eslint/no-unsafe-return': 'off',
				'@typescript-eslint/restrict-plus-operands': 'off',
				'@typescript-eslint/restrict-template-expressions': 'off',
				'@typescript-eslint/naming-convention': 'off',
				'@typescript-eslint/prefer-regexp-exec': 'off',
				'@typescript-eslint/no-explicit-any': 'off',
			},
			extends: [
				'plugin:@typescript-eslint/recommended',
				'plugin:@typescript-eslint/recommended-requiring-type-checking',
			],
		},
		{
			files: ['**/*.test.js'],
			env: {
				mocha: true,
			},
		},
	],
	extends: [
		'eslint:recommended',
		'plugin:react/recommended',
		'prettier',
		'prettier/react',
		'prettier/@typescript-eslint',
	],
}
