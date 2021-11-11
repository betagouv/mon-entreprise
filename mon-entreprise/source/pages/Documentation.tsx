import SearchRules from 'Components/search/SearchRules'
import { FromBottom } from 'Components/ui/animate'
import { ThemeColorsProvider } from 'Components/utils/colors'
import { useEngine } from 'Components/utils/EngineContext'
import Meta from 'Components/utils/Meta'
import { ScrollToTop } from 'Components/utils/Scroll'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { H1 } from 'DesignSystem/typography/heading'
import { Link } from 'DesignSystem/typography/link'
import { Body } from 'DesignSystem/typography/paragraphs'
import rules, { DottedName } from 'modele-social'
import { getDocumentationSiteMap, RulePage } from 'publicodes-react'
import { useCallback, useContext, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Redirect, Route, useHistory, useLocation } from 'react-router-dom'
import { RootState } from 'Reducers/rootReducer'
import styled from 'styled-components'
import { TrackPage } from '../ATInternetTracking'
import RuleLink from '../components/RuleLink'
import { capitalise0 } from '../utils'

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
							renderers={{
								Head: Helmet,
								Link,
								References,
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
	}, [history, url])
	return (
		<Link onPress={handleClick}>
			← <Trans i18nKey="back">Reprendre la simulation</Trans>
		</Link>
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
			<H1>
				<Trans i18nKey="page.documentation.title">Documentation</Trans>
			</H1>
			<Body>Explorez toutes les règles de la documentation</Body>
			<SearchRules />
		</>
	)
}

function DocumentationRulesList() {
	const ruleEntries = Object.keys(rules) as DottedName[]
	return (
		<>
			<H1>Liste des règles</H1>
			{ruleEntries.map((name) => (
				<RuleLink dottedName={name} key={name}>
					{name}
				</RuleLink>
			))}
		</>
	)
}

const referencesImages = {
	'service-public.fr': '/images/références/marianne.png',
	'legifrance.gouv.fr': '/images/références/marianne.png',
	'urssaf.fr': '/images/références/Urssaf.svg',
	'secu-independants.fr': '/images/références/Urssaf.svg',
	'gouv.fr': '/images/références/marianne.png',
	'agirc-arrco.fr': '/images/références/agirc-arrco.png',
	'pole-emploi.fr': '/images/références/pole-emploi.png',
	'ladocumentationfrançaise.fr':
		'/images/références/ladocumentationfrançaise.png',
	'senat.fr': '/images/références/senat.png',
	'ameli.fr': '/images/références/ameli.png',
	'bpifrance-creation.fr': '/images/références/bpi-création.png',
}

type ReferencesProps = React.ComponentProps<
	NonNullable<React.ComponentProps<typeof RulePage>['renderers']['References']>
>

export function References({ references }: ReferencesProps) {
	const cleanDomain = (link: string) =>
		(link.includes('://') ? link.split('/')[2] : link.split('/')[0]).replace(
			'www.',
			''
		)

	return (
		<StyledReferences>
			{Object.entries(references).map(([name, link]) => {
				const domain = cleanDomain(link)
				return (
					<li key={name}>
						<span className="imageWrapper">
							{Object.keys(referencesImages).includes(domain) && (
								<img
									src={
										referencesImages[domain as keyof typeof referencesImages]
									}
									alt={`logo de ${domain}`}
								/>
							)}
						</span>
						<a href={link} target="_blank">
							{capitalise0(name)}
						</a>
						<span className="ui__ label">{domain}</span>
					</li>
				)
			})}
		</StyledReferences>
	)
}

const StyledReferences = styled.ul`
	list-style: none;
	padding: 0;
	a {
		flex: 1;
		min-width: 45%;
		text-decoration: underline;
		margin-right: 1rem;
	}

	li {
		margin-bottom: 0.6em;
		width: 100%;
		display: flex;
		align-items: center;
	}
	.imageWrapper {
		width: 4.5rem;
		height: 3rem;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 1rem;
	}
	img {
		max-height: 3rem;
		vertical-align: sub;
		max-width: 100%;
		border-radius: 0.3em;
	}
`
