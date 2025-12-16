// eslint-disable-next-line no-undef
const tsconfigRootDir = __dirname

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
				tsconfigRootDir,
				project: ['*/tsconfig.json'],
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
				'@typescript-eslint/no-unused-vars': [
					'error',
					{ ignoreRestSiblings: true },
				],

				'react-hooks/rules-of-hooks': 'error',
				'react-hooks/exhaustive-deps': [
					'warn',
					{ additionalHooks: 'usePromise|useLazyPromise' },
				],

				'@typescript-eslint/no-unsafe-call': 'warn',
				'@typescript-eslint/no-unsafe-argument': 'warn',
				'@typescript-eslint/no-unsafe-member-access': 'warn',
				'@typescript-eslint/no-unsafe-return': 'warn',
				'@typescript-eslint/no-unsafe-assignment': 'warn',

				'@typescript-eslint/member-delimiter-style': [
					'error',
					{ multiline: { delimiter: 'none' } },
				],

				'react/no-unknown-property': ['error', { ignore: ['css'] }],

				/**
				 * Warning on props spreading cause typescript doesn't check type on it:
				 * https://github.com/microsoft/TypeScript/issues/18801#issuecomment-332610604
				 * Explicit spread is allow, example: <img {...{ prop1, prop2, prop3 }} />
				 */
				'react/jsx-props-no-spreading': ['warn', { explicitSpread: 'ignore' }],

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
				'no-restricted-imports': [
					'warn',
					{
						paths: [
							{
								name: 'styled-components',
								importNames: ['default'],
								message:
									'Please use named import : `import { styled } from "styled-component"` instead.',
							},
						],
						patterns: [
							{
								group: ['@/design-system/*', '!@/design-system'],
								message: 'Importez uniquement depuis @/design-system (l\'index). Les imports directs sont interdits.',
							},
							{
								group: ['@/contextes/*/*'],
								message: 'Importez uniquement depuis l\'index du contexte. Les imports directs sont interdits.',
							},
						],
					},
				],
			},
		},
		// Cypress rules
		{
			files: ['site/cypress/**/*.ts'],
			parser: '@typescript-eslint/parser',
			parserOptions: {
				tsconfigRootDir,
				project: ['site/cypress/tsconfig.json'],
			},
			extends: ['eslint:recommended', 'plugin:cypress/recommended', 'prettier'],
			plugins: ['@typescript-eslint', 'cypress'],
			rules: {},
		},
		{
			files: ['site/cypress/**/*.js'],
			extends: ['eslint:recommended', 'plugin:cypress/recommended', 'prettier'],
			plugins: ['@typescript-eslint', 'cypress'],
			rules: {},
		},
		// Jest rules (for Vitest)
		{
			files: ['site/**/*.test.{js,ts,tsx,jsx}'],
			extends: [
				'eslint:recommended',
				'plugin:vitest/recommended',
				'plugin:testing-library/react',
				'prettier',
			],
			plugins: ['@typescript-eslint', 'vitest', 'testing-library'],
			rules: {
				'vitest/expect-expect': [
					'error',
					{
						assertFunctionNames: ['expect', 'runSimulations', "expectTypeOf"],
						additionalTestBlockFunctions: [],
					},
				],
			},
		},
		// Accessibility rules on /site
		{
			files: ['site/**/*.{jsx,js,tsx,ts}'],
			plugins: ['jsx-a11y'],
			extends: ['plugin:jsx-a11y/strict'],
			rules: {
				'jsx-a11y/no-autofocus': 'warn',
			},
		},
	],
}
