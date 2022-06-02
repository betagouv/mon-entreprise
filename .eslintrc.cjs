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
				project: ['./**/tsconfig.json'],
			},
			extends: [
				'eslint:recommended',
				'standard',
				'plugin:@typescript-eslint/recommended',
				'plugin:@typescript-eslint/recommended-requiring-type-checking',
				'plugin:react/recommended',
				'plugin:react/jsx-runtime',
				'plugin:react-hooks/recommended',
				'prettier',
			],
			plugins: ['@typescript-eslint', 'react', 'react-hooks'],
			rules: {
				'no-void': 'off',
				'ban-ts-comment': 'off',
				'no-use-before-define': 'off',
				'react/no-unescaped-entities': 'off',
				'react/jsx-no-target-blank': 'off',
				'@typescript-eslint/ban-ts-comment': 'off',

				'react-hooks/rules-of-hooks': 'error',
				'react-hooks/exhaustive-deps': 'warn',

				'@typescript-eslint/no-unsafe-call': 'warn',
				'@typescript-eslint/no-unsafe-argument': 'warn',
				'@typescript-eslint/no-unsafe-member-access': 'warn',
				'@typescript-eslint/no-unsafe-return': 'warn',
				'@typescript-eslint/no-unsafe-assignment': 'warn',

				'@typescript-eslint/member-delimiter-style': [
					'error',
					{ multiline: { delimiter: 'none' } },
				],

				// Auto fixable lint error
				'prefer-const': 'error',
				'padding-line-between-statements': [
					'error',
					// Require padding line before return statement
					{ blankLine: 'always', prev: '*', next: 'return' },
					//Require padding line after import
					{ blankLine: 'always', prev: ['import', 'cjs-import'], next: '*' },
					{
						blankLine: 'any',
						prev: ['import', 'cjs-import'],
						next: ['import', 'cjs-import'],
					},
					//Require padding line before export
					{ blankLine: 'always', prev: '*', next: ['export', 'cjs-export'] },
					{
						blankLine: 'any',
						prev: ['export', 'cjs-export'],
						next: ['export', 'cjs-export'],
					},
				],
			},
		},
		{
			files: ['**/*.test.{js,ts}', 'site/cypress/**/*.js'],
			env: {
				mocha: true,
			},
			extends: [
				'eslint:recommended',
				'plugin:cypress/recommended',
				'plugin:mocha/recommended',
				'prettier',
			],
			plugins: ['cypress', 'mocha'],
			rules: {
				'cypress/no-unnecessary-waiting': 'warn',

				'mocha/no-exclusive-tests': 'error',
				'mocha/no-skipped-tests': 'warn',
				'mocha/no-mocha-arrows': 'warn',
				'mocha/no-setup-in-describe': 'warn',
				'mocha/max-top-level-suites': 'warn',
				'mocha/no-global-tests': 'warn',
				'mocha/no-exports': 'warn',
			},
		},
	],
}
