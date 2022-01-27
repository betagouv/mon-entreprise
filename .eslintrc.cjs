module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
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
	extends: ['eslint:recommended', 'prettier'],
	rules: {
		quotes: ['warn', 'single', { avoidEscape: true }],
		'no-console': 'warn',
		'no-restricted-globals': ['error', 'length'],
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
			files: ['**/*.{js,jsx}'],
			env: { node: true },
		},
		{
			files: ['**/*.{ts,tsx}'],
			parser: '@typescript-eslint/parser',
			parserOptions: {
				ecmaFeatures: { jsx: true },
				// eslint-disable-next-line no-undef
				tsconfigRootDir: __dirname,
				project: ['./site/tsconfig.json'],
			},
			extends: [
				'eslint:recommended',
				'plugin:@typescript-eslint/recommended',
				'plugin:@typescript-eslint/recommended-requiring-type-checking',
				'plugin:react/recommended',
				'plugin:react/jsx-runtime',
				'plugin:react-hooks/recommended',
				'prettier',
			],
			plugins: ['@typescript-eslint', 'react', 'react-hooks'],
			rules: {
				'ban-ts-comment': 'off',
				'react/no-unescaped-entities': 'off',
				'@typescript-eslint/no-unsafe-call': 'warn',
				'@typescript-eslint/no-unsafe-argument': 'warn',
				'@typescript-eslint/no-unsafe-member-access': 'warn',
				'@typescript-eslint/restrict-template-expressions': 'warn',
				'@typescript-eslint/no-unsafe-return': 'warn',
				'@typescript-eslint/no-unsafe-assignment': 'warn',
				'@typescript-eslint/no-empty-function': 'warn',
				'@typescript-eslint/restrict-plus-operands': 'warn',
				'@typescript-eslint/no-floating-promises': 'warn',
				'@typescript-eslint/ban-ts-comment': 'warn',
				'react-hooks/rules-of-hooks': 'error',
				'react-hooks/exhaustive-deps': 'warn',
				'@typescript-eslint/member-delimiter-style': [
					'error',
					{ multiline: { delimiter: 'none' } },
				],
			},
		},
		{
			files: ['**/*.test.{js,ts}', 'site/cypress/integration/**/*.js'],
			env: {
				mocha: true,
				jest: true,
			},
			extends: ['eslint:recommended', 'plugin:mocha/recommended', 'prettier'],
			plugins: ['mocha'],
			rules: {
				'mocha/no-skipped-tests': 'warn',
				'mocha/no-exclusive-tests': 'error',
				'mocha/no-mocha-arrows': 'warn',
				'mocha/no-setup-in-describe': 'warn',
				'mocha/max-top-level-suites': 'warn',
				'mocha/no-global-tests': 'warn',
			},
		},
	],
}
