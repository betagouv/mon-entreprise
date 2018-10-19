import i18next from 'i18next'
import Backend from 'i18next-locize-backend'
import Editor from 'locize-editor'
import queryString from 'query-string'
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

setToSessionStorage('lang', lang)
i18next
	.use(Backend)
	.use(Editor)
	.init({
		lng: lang,
		updateMissing: true,
		saveMissing: true,
		backend: {
			projectId: '1386fdd2-7b4a-4071-97ed-18491235573b',
			apiKey: '7a03de7d-01e5-4738-ad4a-437da315168b',
			referenceLng: 'fr'
		}
	})

export default i18next
