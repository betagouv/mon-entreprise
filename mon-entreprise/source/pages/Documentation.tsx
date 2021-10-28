import SearchRules from 'Components/search/SearchRules'
import { FromBottom } from 'Components/ui/animate'
import { ThemeColorsProvider } from 'Components/utils/colors'
import { useEngine } from 'Components/utils/EngineContext'
import { ScrollToTop } from 'Components/utils/Scroll'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { RulePage, getDocumentationSiteMap } from 'publicodes-react'
import { useCallback, useContext, useMemo } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Redirect, useHistory, useLocation, Link } from 'react-router-dom'
import { RootState } from 'Reducers/rootReducer'
import { TrackPage } from '../ATInternetTracking'
import rules, { DottedName } from 'modele-social'
import RuleLink from '../components/RuleLink'
import Meta from 'Components/utils/Meta'
import { Route } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

export default function MonEntrepriseRulePage() {
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
				<Route
					path={documentationPath + '/:name+'}
					render={({ match }) => (
						<RulePage
							language={i18n.language as 'fr' | 'en'}
							rulePath={match.params.name}
							engine={engine}
							documentationPath={documentationPath}
							referenceImages={referencesImages}
							renderers={{
								Head: Helmet,
								Link,
							}}
						/>
					)}
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
			<Meta
				page="documentation"
				title="Documentation"
				description="Explorez toutes les règles de la documentation"
			/>
			<h1>
				<Trans i18nKey="page.documentation.title">Documentation</Trans>
			</h1>
			<p>Explorez toutes les règles de la documentation</p>
			<SearchRules />
		</>
	)
}

function DocumentationRulesList() {
	const ruleEntries = Object.keys(rules) as DottedName[]
	return (
		<>
			<h1>Liste des règles</h1>
			{ruleEntries.map((name) => (
				<RuleLink dottedName={name} key={name}>
					{name}
				</RuleLink>
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
