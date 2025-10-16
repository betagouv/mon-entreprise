import { getDocumentationSiteMap, RulePage } from '@publicodes/react-ui'
import rules, { RègleModeleSocial } from 'modele-social'
import Engine from 'publicodes'
import { ComponentProps, lazy, Suspense, useMemo, useRef } from 'react'
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
import { styled } from 'styled-components'

import { TrackPage } from '@/components/ATInternetTracking'
import { References } from '@/components/References'
import { FromBottom } from '@/components/ui/animate'
import Loader from '@/components/utils/Loader'
import Meta from '@/components/utils/Meta'
import ScrollToTop from '@/components/utils/Scroll/ScrollToTop'
import {
	Accordion,
	Button,
	Item,
	Markdown,
	Spacing,
	typography,
} from '@/design-system'
import { useSitePaths } from '@/sitePaths'
import { RootState } from '@/store/reducers/rootReducer'

import RuleLink from '../components/RuleLink'

const { Body, H1, H2, H3, H4, H5, Li, Link, Ul, StyledLink } = typography

const LazySearchRules = lazy(() => import('@/components/search/SearchRules'))

export default function Documentation({
	documentationPath,
	engine,
}: {
	documentationPath: string
	engine: Engine
}) {
	const { t } = useTranslation()
	const location = useLocation()
	const pathname = decodeURI(location?.pathname ?? '')
	const documentationSitePaths = useMemo(
		() => getDocumentationSiteMap({ engine, documentationPath }),
		[engine, documentationPath]
	)

	return (
		<Routes>
			<Route index element={<DocumentationLanding />} />
			{IS_DEVELOPMENT && (
				<Route path="dev" element={<DocumentationRulesList />} />
			)}
			<Route
				path="*"
				element={
					!documentationSitePaths[pathname] ? (
						<Navigate to="/404" replace />
					) : (
						<>
							<Meta
								title={t('pages.documentation.meta.title', 'Documentation')}
								description={t(
									'pages.documentation.meta.description',
									'Documentation des règles de calcul de nos simulateurs et assistants'
								)}
							/>
							<div id="mobile-menu-portal-id" />
							<FromBottom>
								<TrackPage
									chapter1="documentation"
									name={documentationSitePaths[pathname]}
								/>
								<ScrollToTop key={pathname} />
								<BackToSimulation />
								<Spacing xl />
								<DocumentationPageBody
									engine={engine}
									documentationPath={documentationPath}
								/>
							</FromBottom>
						</>
					)
				}
			/>
		</Routes>
	)
}

const StyledAccordion = styled(Accordion)`
	margin: 1.5rem 0;
	overflow: hidden;

	${Accordion.StyledTitle} {
		margin: 0;
		& span {
			font-weight: bold;
		}
	}
`

type Renderers = ComponentProps<typeof RulePage>['renderers']
type AccordionProps = ComponentProps<NonNullable<Renderers['Accordion']>>

const CustomAccordion = ({ items }: AccordionProps) => (
	<StyledAccordion>
		{items.map(({ title, id, children }) => (
			<Item title={title} key={id} hasChildItems={false}>
				{children}
			</Item>
		))}
	</StyledAccordion>
)

function DocumentationPageBody({
	documentationPath,
	engine,
}: {
	documentationPath: string
	engine: Engine
}) {
	const { absoluteSitePaths } = useSitePaths()
	const { i18n } = useTranslation()
	const params = useParams<{ '*': string }>()

	const { current: renderers } = useRef({
		Head: Helmet,
		Link,
		Text: Markdown,
		References,
		Accordion: CustomAccordion,
	} as ComponentProps<typeof RulePage>['renderers'])

	return (
		<StyledDocumentation>
			<RulePage
				language={i18n.language as 'fr' | 'en'}
				rulePath={params['*'] ?? ''}
				engine={engine}
				documentationPath={documentationPath}
				renderers={renderers}
				apiDocumentationUrl={absoluteSitePaths.développeur.api}
				apiEvaluateUrl="https://mon-entreprise.urssaf.fr/api/v1/evaluate"
				npmPackage="modele-social"
				mobileMenuPortalId="mobile-menu-portal-id"
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
				<span aria-hidden>←</span>{' '}
				<Trans i18nKey="pages.documentation.back">
					Retourner à la simulation
				</Trans>
			</Button>
		</>
	)
}

function DocumentationLanding() {
	const { t } = useTranslation()

	return (
		<>
			<TrackPage chapter1="documentation" name="accueil" />
			<Meta
				title={t('pages.documentation.meta.title', 'Documentation')}
				description={t(
					'pages.documentation.meta.descriptionBis',
					'Explorez toutes les règles de la documentation'
				)}
			/>
			<H1>
				<Trans i18nKey="pages.documentation.title">Documentation</Trans>
			</H1>
			<Body>Explorez toutes les règles de la documentation</Body>
			<Suspense fallback={<Loader />}>
				<LazySearchRules />
			</Suspense>
		</>
	)
}

function DocumentationRulesList() {
	const ruleEntries = Object.keys(rules) as RègleModeleSocial[]

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

	font-family: ${({ theme }) => theme.fonts.main};

	.publicodes_btn-small {
		font-size: 0.8rem;
		background-color: ${({ theme }) => theme.colors.extended.grey[200]};
		border-radius: ${({ theme }) => theme.box.borderRadius};
		border: none;
		padding: ${({ theme }) => theme.spacings.xxs}
			${({ theme }) => theme.spacings.xs};
		color: ${({ theme }) => theme.colors.extended.grey[800]};

		&:hover {
			background-color: ${({ theme }) => theme.colors.extended.grey[300]};
		}
	}
	#documentation-rule-root nav ul li span button,
	#documentation-rule-root nav ul li.active .content {
		background-color: hsl(0deg 0% 90% / 50%);
	}
	#documentation-rule-root .node-value-pointer,
	#documentation-rule-root pre {
		background-color: ${({ theme }) =>
			theme.darkMode && theme.colors.extended.dark[600]};
	}
`
