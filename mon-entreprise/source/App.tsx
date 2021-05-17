import Footer from 'Components/layout/Footer/Footer'
import Header from 'Components/layout/Header'
import 'Components/ui/index.css'
import {
	engineFactory,
	EngineProvider,
	Rules,
} from 'Components/utils/EngineContext'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import 'iframe-resizer'
import { useContext, useMemo } from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import './App.css'
import Provider, { ProviderProps } from './Provider'
import { constructLocalizedSitePath } from './sitePaths'
import {
	retrievePersistedInFranceApp,
	setupInFranceAppPersistence,
} from './storage/persistInFranceApp'
import { setupSimulationPersistence } from './storage/persistSimulation'

type RootProps = {
	basename: ProviderProps['basename']
	rules: Rules
}

export default function Root({ basename, rules, children }: RootProps) {
	const { language } = useTranslation().i18n
	const paths = constructLocalizedSitePath(language as 'fr' | 'en')
	console.log('YODOLOD', paths, language)
	const engine = useMemo(() => engineFactory(rules), [rules])
	return (
		<Provider
			basename={basename}
			sitePaths={paths}
			onStoreCreated={(store) => {
				setupInFranceAppPersistence(store)
				setupSimulationPersistence(store)
			}}
			initialStore={{
				inFranceApp: retrievePersistedInFranceApp(),
			}}
		>
			<EngineProvider value={engine}>
				<App>{children}</App>
			</EngineProvider>
		</Provider>
	)
}

const App = ({ children }) => {
	const { t } = useTranslation()
	const sitePaths = useContext(SitePathsContext)

	return (
		<>
			<Header />
			<div className="app-container">
				<Helmet
					titleTemplate={`${t(['site.titleTemplate', '%s - Mon-entreprise'])}`}
				/>
				{/* Passing location down to prevent update blocking */}
				<div className="ui__ container app-content">{children}</div>
				<Footer />
			</div>
		</>
	)
}
