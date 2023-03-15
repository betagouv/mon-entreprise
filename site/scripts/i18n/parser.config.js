import { UiStaticAnalysisPath } from './utils.js'

export default {
	contextSeparator: '_',
	// Key separator used in your translation keys

	createOldCatalogs: false,
	// Save the \_old files

	defaultNamespace: 'translation',
	// Default namespace used in your i18next config

	// Default value to give to empty keys
	defaultValue(locale, namespace, key, value) {
		return key === value || (key && value === '') ? 'NO_TRANSLATION' : value
	},

	indentation: 2,
	// Indentation of the catalog files

	keepRemoved: false,
	// Keep keys from the catalog that are no longer in code

	keySeparator: false,
	// Key separator used in your translation keys
	// If you want to use plain english keys, separators such as `.` and `:` will conflict. You might want to set `keySeparator: false` and `namespaceSeparator: false`. That way, `t('Status: Loading...')` will not think that there are a namespace and three separator dots for instance.

	// see below for more details
	lexers: {
		hbs: ['HandlebarsLexer'],
		handlebars: ['HandlebarsLexer'],

		htm: ['HTMLLexer'],
		html: ['HTMLLexer'],

		mjs: ['JavascriptLexer'],
		js: [
			{
				lexer: 'JavascriptLexer',
				functions: ['t'], // Array of functions to match
			},
		],
		ts: [
			{
				lexer: 'JavascriptLexer',
				functions: ['t'], // Array of functions to match
			},
		],
		tsx: [
			{
				lexer: 'JsxLexer',
				functions: ['t'], // Array of functions to match
			},
		],
		jsx: [
			{
				lexer: 'JsxLexer',
				functions: ['t'], // Array of functions to match
			},
		],
		default: ['JavascriptLexer'],
	},

	lineEnding: 'auto',
	// Control the line ending. See options at https://github.com/ryanve/eol

	locales: ['fr'],
	// An array of the locales in your applications

	namespaceSeparator: false,
	// Namespace separator used in your translation keys
	// If you want to use plain english keys, separators such as `.` and `:` will conflict. You might want to set `keySeparator: false` and `namespaceSeparator: false`. That way, `t('Status: Loading...')` will not think that there are a namespace and three separator dots for instance.

	output: UiStaticAnalysisPath,
	// Supports $LOCALE and $NAMESPACE injection
	// Supports JSON (.json) and YAML (.yml) file formats
	// Where to write the locale files relative to process.cwd()

	input: [
		'../../source/**/*.{jsx,tsx,js,ts}',
		'!../../source/components/ATInternetTracking/smarttag.js',
	],
	// An array of globs that describe where to look for source files
	// relative to the location of the configuration file

	reactNamespace: false,
	// For react file, extract the defaultNamespace
	// Ignored when parsing a `.jsx` file and namespace is extracted from that file.

	sort: true,
	// Whether or not to sort the catalog

	resetDefaultValueLocale: 'fr',
	// The locale to compare with default values to determine whether a default value has been changed.
	// If this is set and a default value differs from a translation in the specified locale, all entries
	// for that key across locales are reset to the default value, and existing translations are moved to
	// the `_old` file.

	verbose: false,
	// Display info about the parsing including some stats

	failOnWarnings: true,
}
