import SearchRules from 'Components/search/SearchRules'
import SearchButton from 'Components/SearchButton'
import { FromBottom } from 'Components/ui/animate'
import { ThemeColorsProvider } from 'Components/utils/colors'
import { useEngine } from 'Components/utils/EngineContext'
import { ScrollToTop } from 'Components/utils/Scroll'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { Documentation, getDocumentationSiteMap } from 'publicodes-react'
import { useCallback, useContext, useMemo } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Redirect, useHistory, useLocation } from 'react-router-dom'
import { RootState } from 'Reducers/rootReducer'
import { TrackPage } from '../ATInternetTracking'
import rules from 'modele-social'
import RuleLink from '../components/RuleLink'

export default function RulePage() {
	const currentSimulation = useSelector(
		(state: RootState) => !!state.simulation?.url
	)
	const documentationColor = useSelector(
		(state: RootState) => state.simulation?.config.color
	)
	const engine = useEngine()
	const documentationPath = useContext(SitePathsContext).documentation.index
	const { pathname } = useLocation()
	const documentationSitePaths = useMemo(
		() => getDocumentationSiteMap({ engine, documentationPath }),
		[engine, documentationPath]
	)
	const { i18n } = useTranslation()

	if (pathname === '/documentation') {
		return <DocumentationLanding />
	}

	if (pathname === '/documentation/dev') {
		return <DocumentationRulesList />
	}

	if (!documentationSitePaths[pathname]) {
		return <Redirect to="/404" />
	}

	return (
		<FromBottom>
			<TrackPage
				chapter1="documentation"
				name={documentationSitePaths[pathname]}
			/>
			<ScrollToTop key={pathname} />
			<ThemeColorsProvider color={documentationColor}>
				<div
					css={`
						display: flex;
						margin-top: 2rem;
						justify-content: space-between;
					`}
				>
					{currentSimulation ? <BackToSimulation /> : <span />}
				</div>
				<Documentation
					language={i18n.language as 'fr' | 'en'}
					engine={engine}
					documentationPath={documentationPath}
					referenceImages={referencesImages}
				/>
			</ThemeColorsProvider>
		</FromBottom>
	)
}

function BackToSimulation() {
	const url = useSelector((state: RootState) => state.simulation?.url)
	const history = useHistory()
	const handleClick = useCallback(() => {
		url && history.push(url)
	}, [])
	return (
		<button
			className="ui__ simple small push-left button"
			onClick={handleClick}
		>
			← <Trans i18nKey="back">Reprendre la simulation</Trans>
		</button>
	)
}

function DocumentationLanding() {
	return (
		<>
			<TrackPage chapter1="documentation" name="accueil" />
			<h1>
				<Trans i18nKey="page.documentation.title">Documentation</Trans>
			</h1>
			<p>Explorez toutes les règles de la documentation</p>
			<SearchRules />
		</>
	)
}

function DocumentationRulesList() {
	const ruleEntries = Object.entries(rules)
	return (
		<>
			<h1>Liste des règles</h1>
			{ruleEntries.map(([name]) => (
				<RuleLink dottedName={name}>{name}</RuleLink>
			))}
		</>
	)
}

const referencesImages = {
	'service-public.fr': 'images/références/marianne.png',
	'urssaf.fr': 'images/références/Urssaf.svg',
	'secu-independants.fr': 'images/références/Urssaf.svg',
	'gouv.fr': 'images/références/marianne.png',
	'agirc-arrco.fr': 'images/références/agirc-arrco.png',
	'pole-emploi.fr': 'images/références/pole-emploi.png',
	'ladocumentationfrançaise.fr':
		'images/références/ladocumentationfrançaise.png',
	'senat.fr': 'images/références/senat.png',
	'ameli.fr': 'images/références/ameli.png',
	'bpifrance-creation': 'images/références/bpi-création.png',
}
