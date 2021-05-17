// import 'core-js/stable'
import rules from 'modele-social'
// import 'regenerator-runtime/runtime'
import App from '../source/App'
import i18next from '../source/locales/i18n'
import translations from '../source/locales/ui-en.yaml'
import useSimulatorsData from '../source/pages/Simulateurs/metadata'
import SimulateurPage from '../source/pages/Simulateurs/Page'
import '../source/sentry'

i18next.addResourceBundle('en', 'translation', translations)
i18next.changeLanguage('en')

export default function Index() {
	return (
		<App basename="mon-entreprise" rules={rules}>
			<ZOUBADLAD />
		</App>
	)
}

function ZOUBADLAD() {
	const metada = useSimulatorsData()
	return <SimulateurPage {...metada.salarié} />
}
