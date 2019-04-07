import { React, emoji } from 'Components'
import { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { flatRulesSelector } from 'Selectors/analyseSelectors'
import { Link } from 'react-router-dom'
import Fuse from 'fuse.js'
import searchWeights from 'Components/searchWeights'
import { pick } from 'ramda'
import { findRuleByDottedName } from 'Engine/rules'

let buildFuse = rules =>
	new Fuse(
		rules.map(pick(['title', 'espace', 'description', 'name', 'dottedName'])),
		{
			keys: searchWeights,
			threshold: 0.3
		}
	)

export default connect(state => ({ rules: flatRulesSelector(state) }))(
	({ input, rules }) => {
		let exposedRules = rules.filter(rule => rule.exposé === 'oui')

		let [fuse, setFuse] = useState(null)
		useEffect(() => setFuse(buildFuse(exposedRules)), [])

		let filteredRules = fuse && input ? fuse.search(input) : exposedRules

		return (
			<section style={{ marginTop: '3rem' }}>
				{filteredRules.length ? (
					<h2 css="font-size: 100%;">
						{(input ? 'Résultats' : 'Suggestions') + ' :'}
					</h2>
				) : (
					<p>Rien trouvé {emoji('😶')}. </p>
				)}
				{filteredRules && (
					<ul css="display: flex; flex-wrap: wrap; justify-content: space-evenly">
						{filteredRules.map(({ dottedName }) => (
							<Suggestion
								key={dottedName}
								{...findRuleByDottedName(rules, dottedName)}
							/>
						))}
					</ul>
				)}
			</section>
		)
	}
)

let Suggestion = ({ dottedName, formule, title, icônes }) => (
	<li
		key={dottedName}
		css={`
			font-size: 100%;
			list-style-type: none;
			border-radius: 1.5rem;
			padding: 0.6rem;
			margin: 0.6rem;
			width: 10rem;
			min-height: 7em;
			position: relative;
			display: flex;
			align-items: center;
			justify-content: middle;
			text-align: center;
			flex-wrap: wrap;
			${formule ? '' : 'filter: grayscale(70%); opacity: 0.6;'}

			background: var(--colour);
			color: white;
			:hover {
				box-shadow: 0 1px 6px rgba(32, 33, 36, 0.5);
			}
			a {
				color: white;
				text-decoration: none;
			}
		`}>
		<div css="width: 100%; img { width: 1.8rem !important; height: 1.8rem !important}}">
			{icônes && emoji(icônes + ' ')}
		</div>
		<Link css="width: 100%" to={formule ? '/simulateur/' + dottedName : '#'}>
			{title}
		</Link>
		{!formule && (
			<>
				<div css="visibility: hidden">placeholder</div>
				<div
					css={`
						position: absolute;
						border-bottom-left-radius: 1.2rem;
						border-bottom-right-radius: 1.2rem;
						bottom: 0;
						left: 0;
						width: 100%;
						background: var(--colour);
						color: white;
						font-size: 80%;
					`}>
					Prochainement !
				</div>
			</>
		)}
	</li>
)
