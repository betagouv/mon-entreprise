import { goBackToSimulation } from 'Actions/actions'
import SearchButton from 'Components/SearchButton'
import * as Animate from 'Components/ui/animate'
import { EngineContext } from 'Components/utils/EngineContext'
import { ScrollToTop } from 'Components/utils/Scroll'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { Documentation, getDocumentationSiteMap } from 'publicodes'
import React, { useCallback, useContext, useMemo, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect, useLocation, Link } from 'react-router-dom'
import { RootState } from 'Reducers/rootReducer'
import emoji from 'react-easy-emoji'
import couvertureLegislative from '../../../rules/couverture-legislative.json'
import styled from 'styled-components'
import animate from 'Components/ui/animate'
import RuleLink from 'Components/RuleLink'
import useSimulatorsData, { simulateurs } from './Simulateurs/metadata'

type CouvertureLegislative = Array<Category>
type Category = string | [string, Array<Node>]
type Node = string | { rule: string; simulator?: simulateurs }

export default function RulePage() {
	const currentSimulation = useSelector(
		(state: RootState) => !!state.simulation?.url
	)
	const engine = useContext(EngineContext)
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
	if (!documentationSitePaths[pathname]) {
		return <Redirect to="/404" />
	}
	return (
		<Animate.fromBottom>
			<ScrollToTop key={pathname} />
			<div
				css={`
					display: flex;
					margin-top: 2rem;
					justify-content: space-between;
				`}
			>
				{currentSimulation ? <BackToSimulation /> : <span />}
				<SearchButton key={pathname} />
			</div>
			<Documentation
				language={i18n.language as 'fr' | 'en'}
				engine={engine}
				documentationPath={documentationPath}
			/>
			{/* <button>Voir l</button> */}
		</Animate.fromBottom>
	)
}
function BackToSimulation() {
	const dispatch = useDispatch()
	const handleClick = useCallback(() => {
		dispatch(goBackToSimulation())
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
	const sitePaths = useContext(SitePathsContext)
	const { pathname } = useLocation()
	const [currentlyOpenAccordeon, setCurrentlyOpenAccordeon] = useState()
	return (
		<>
			<ScrollToTop key={pathname} />
			<h1>
				<Trans i18nKey="page.documentation.title">
					Couverture législative <>{emoji('⚖')}</>
				</Trans>
			</h1>
			<p>
				Cette page référence les dispositifs existants dans la législation
				française en matière de droit de la sécurité sociale, droit fiscal, et
				plus partiellement en droit du travail. Cette liste n'est pas exhaustive
				mais permet d'avoir un aperçu synthétique des sujets couverts et de ceux
				non couverts par{' '}
				<Link to={sitePaths.simulateurs.index}>nos simulateurs</Link>.
			</p>
			<hr />
			<div className="ui__ card light-border">
				{(couvertureLegislative as CouvertureLegislative).map(cat => {
					const title = Array.isArray(cat) ? cat[0] : cat
					const isOpen = currentlyOpenAccordeon === title
					return (
						<CategorySection key={title} className={isOpen ? 'isOpen' : ''}>
							<h3
								onClick={() => setCurrentlyOpenAccordeon(isOpen ? null : title)}
							>
								{emoji(title)}
							</h3>
							{isOpen && (
								<animate.fromTop>
									<ul>
										{Array.isArray(cat) &&
											cat[1]?.map((node, i) => (
												<li key={i}>
													<Node node={node} />
												</li>
											))}
									</ul>
								</animate.fromTop>
							)}
						</CategorySection>
					)
				})}
			</div>
		</>
	)
}

const CategorySection = styled.div`
	border-top: 2px solid var(--lighterColor);

	&:first-child {
		border-top: none;
	}

	h3 {
		cursor: pointer;
	}

	h3:after {
		display: block;
		content: '↓';
		float: right;
		transition: transform 0.4s ease-in-out;
	}

	&.isOpen h3:after {
		transform: rotate(180deg);
	}
`

function Node({ node, level = 1 }) {
	const isCategory = Array.isArray(node)
	const simulatorsData = useSimulatorsData()
	if (isCategory && level < 2) {
		return (
			<p>
				<strong>{node[0]}</strong>
				<ul>
					{node[1].map((node, i) => (
						<li key={i}>
							<Node node={node} level={level + 1} />
						</li>
					))}
				</ul>
			</p>
		)
	} else if (isCategory && level == 2) {
		return (
			<>
				{node[0]} (
				{node[1].map((node, i) => (
					<React.Fragment key={i}>
						{i + 1 !== node[1].length && ', '}
						<Node node={node} level={level + 1} />
					</React.Fragment>
				))}
				)
			</>
		)
	} else {
		const { rule, label, simulator } =
			typeof node === 'string' ? { label: node } : node
		return (
			<>
				{rule ? <RuleLink dottedName={rule}>{label}</RuleLink> : label}
				{simulator && (
					<>
						{' '}
						<Link to={simulatorsData[simulator].path}>→ Simulateur</Link>
					</>
				)}
			</>
		)
	}
}
