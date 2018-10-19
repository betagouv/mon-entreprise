import i18next from 'i18next'
import Backend from 'i18next-locize-backend'
import Editor from 'locize-editor'
import queryString from 'query-string'
import { reactI18nextModule } from 'react-i18next'
import { getIframeOption, parseDataAttributes } from './utils'

let getFromSessionStorage = where =>
	typeof sessionStorage !== 'undefined' ? sessionStorage[where] : null

let setToSessionStorage = (where, what) =>
	typeof sessionStorage !== 'undefined' &&
	do {
		sessionStorage[where] = what
	}

let lang =
	getIframeOption('lang') ||
	queryString.parse(location.search)['lang'] ||
	parseDataAttributes(getFromSessionStorage('lang')) ||
	'fr'

if (lang === 'fr') {
	lang = 'fr-FR'
}
if (lang === 'en') {
	lang = 'en-UK'
}
setToSessionStorage('lang', lang)
i18next
	.use(Backend)
	.use(Editor)
	.use(reactI18nextModule)
	.init({
		fallbackLng: 'fr-FR',
		appendNamespaceToCIMode: true,
		saveMissing: true,
		lng: lang,

		// have a common namespace used around the full app
		ns: ['translations'],
		defaultNS: 'translations',

		debug: true,
		keySeparator: '### not used ###', // we use content as keys
		nsSeparator: '### not used ###', // we use content as keys

		interpolation: {
			escapeValue: false, // not needed for react!!
			formatSeparator: ',',
			format: function(value, format, lng) {
				if (format === 'uppercase') return value.toUpperCase()
				return value
			}
		},

		react: {
			wait: true
		},

		editor: {
			// trigger a reload on editor save
			onEditorSaved: function(lng, ns) {
				i18next.reloadResources(lng, ns)
			}
		},
		backend: {
			projectId: '1386fdd2-7b4a-4071-97ed-18491235573b',
			apiKey: '7a03de7d-01e5-4738-ad4a-437da315168b',
			referenceLng: 'fr-FR'
		}
	})

export default i18next
