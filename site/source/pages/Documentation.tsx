import { References } from '@/components/References'
import SearchRules from '@/components/search/SearchRules'
import { FromBottom } from '@/components/ui/animate'
import { useEngine } from '@/components/utils/EngineContext'
import { Markdown } from '@/components/utils/markdown'
import Meta from '@/components/utils/Meta'
import { ScrollToTop } from '@/components/utils/Scroll'
import { Button } from '@/design-system/buttons'
import { Grid, Spacing } from '@/design-system/layout'
import { H1, H2, H3, H4, H5 } from '@/design-system/typography/heading'
import { Link, StyledLink } from '@/design-system/typography/link'
import { Li, Ul } from '@/design-system/typography/list'
import { Body } from '@/design-system/typography/paragraphs'
import { RootState } from '@/reducers/rootReducer'
import { useSitePaths } from '@/sitePaths'
import rules, { DottedName } from 'modele-social'
import { getDocumentationSiteMap, RulePage } from 'publicodes-react'
import React, { ComponentType, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import {
	Navigate,
	Route,
	Routes,
	useLocation,
	useParams,
} from 'react-router-dom'
import styled from 'styled-components'
import { TrackPage } from '../ATInternetTracking'
import RuleLink from '../components/RuleLink'

export default function MonEntrepriseRulePage() {
	const engine = useEngine()
	const { absoluteSitePaths } = useSitePaths()
	const documentationPath = absoluteSitePaths.documentation.index
	const location = useLocation()
	const pathname = decodeURI(location?.pathname ?? '')
	const documentationSitePaths = useMemo(
		() => getDocumentationSiteMap({ engine, documentationPath }),
		[engine, documentationPath]
	)

	return (
		<Routes>
			<Route index element={<DocumentationLanding />} />
			<Route path="dev" element={<DocumentationRulesList />} />
			<Route
				path="*"
				element={
					!documentationSitePaths[pathname] ? (
						<Navigate to="/404" replace />
					) : (
						<FromBottom>
							<TrackPage
								chapter1="documentation"
								name={documentationSitePaths[pathname]}
							/>
							<ScrollToTop key={pathname} />
							<Grid item md={10}>
								<BackToSimulation />
								<Spacing xl />
								<DocumentationPageBody />
							</Grid>
						</FromBottom>
					)
				}
			/>
		</Routes>
	)
}

function DocumentationPageBody() {
	const engine = useEngine()
	const { absoluteSitePaths } = useSitePaths()
	const documentationPath = absoluteSitePaths.documentation.index
	const { i18n } = useTranslation()
	const params = useParams<{ '*': string }>()

	return (
		<StyledDocumentation>
			<RulePage
				language={i18n.language as 'fr' | 'en'}
				rulePath={params['*'] ?? ''}
				engine={engine}
				documentationPath={documentationPath}
				renderers={{
					Head: Helmet as ComponentType<{
						children: React.ReactNode
					}>,
					Link: Link as ComponentType<{
						to: string
						children: React.ReactNode
					}>,
					Text: Markdown,
					References,
				}}
			/>
		</StyledDocumentation>
	)
}

function BackToSimulation() {
	const url = useSelector((state: RootState) => state.simulation?.url)
	if (!url) {
		return null
	}

	return (
		<>
			<Spacing lg />
			<Button to={url}>
				← <Trans i18nKey="back">Retourner à la simulation</Trans>
			</Button>
		</>
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

type OverrideComponentType = {
	componentStyle: {
		rules: Array<
			| ((
					props: Record<string, unknown>
			  ) =>
					| string
					| false
					| null
					| undefined
					| OverrideComponentType['componentStyle']['rules'])
			| string
		>
	}
}

// HACKKKKY THING. DO NOT DO THIS AT HOME
function componentCSS(Compo: unknown, props: Record<never, never>): string {
	const rules =
		'componentStyle' in (Compo as OverrideComponentType)
			? (Compo as OverrideComponentType).componentStyle.rules
			: (Compo as string[])

	return rules
		.map((x) => {
			if (typeof x !== 'function') {
				return x
			}
			const result = x(props)
			if ((result ?? false) === false) {
				return ''
			}
			if (typeof result === 'string') {
				return result
			}
			if (Array.isArray(result)) {
				return componentCSS(result, props)
			}
			// eslint-disable-next-line no-console
			console.error('Should not happen', result, typeof result)

			return false
		})
		.join('')
}

const StyledDocumentation = styled.div`
	h1 {
		${(props) => componentCSS(H1, props)}
		margin-top: 1rem;
	}
	h2 {
		${(props) => componentCSS(H2, props)}
	}
	h3 {
		${(props) => componentCSS(H3, props)}
	}
	h4 {
		${(props) => componentCSS(H4, props)}
	}
	h5 {
		${(props) => componentCSS(H5, props)}
	}
	p {
		${(props) => componentCSS(Body, props)}
	}
	Ul {
		${(props) => componentCSS(Ul, props)}
	}
	Li {
		${(props) => componentCSS(Li, props)}
	}
	a {
		${(props) => componentCSS(StyledLink, props)}
	}
	button {
		font-size: 1rem;
		font-family: ${({ theme }) => theme.fonts.main};
	}
	font-size: 1rem;
	font-family: ${({ theme }) => theme.fonts.main};
	line-height: 1.5rem;
`
