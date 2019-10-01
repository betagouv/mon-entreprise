import { React, emoji } from 'Components'
import { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { flatRulesSelector } from 'Selectors/analyseSelectors'
import { Link } from 'react-router-dom'
import Fuse from 'fuse.js'
import searchWeights from 'Components/searchWeights'
import { pick, pipe, concat, partition, has, apply } from 'ramda'
import { findRuleByDottedName, encodeRuleName } from 'Engine/rules'

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

		let filteredRules = pipe(
			partition(has('formule')),
			apply(concat)
		)(fuse && input ? fuse.search(input) : exposedRules)

		return (
			<section style={{ marginTop: '2rem' }}>
				{filteredRules.length ? (
					input && <h2 css="font-size: 100%;">Résultats :</h2>
				) : (
					<p>Rien trouvé {emoji('😶')}</p>
				)}
				{filteredRules && (
					<ul css="display: flex; flex-wrap: wrap; justify-content: space-evenly;     ">
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

let Suggestion = ({ dottedName, formule, title, icônes }) => {
	let hasFormule = formule != null

	return (
		<Link
			to={hasFormule ? '/simulateur/' + encodeRuleName(dottedName) : '#'}
			css={`
				text-decoration: none !important;
				:hover {
					opacity: 1 !important;
				}
			`}>
			<li
				key={dottedName}
				css={`
					font-size: 120%;
					list-style-type: none;
					padding: 1rem;
					margin: 0.6rem;
					width: 10rem;
					min-height: 7em;
					position: relative;
					display: flex;
					align-items: center;
					justify-content: middle;
					text-align: center;
					flex-wrap: wrap;
					line-height: 1.2em;
					${hasFormule ? '' : 'filter: grayscale(70%); opacity: 0.6;'}

					display: flex;
					align-items: center;
					flex-wrap: wrap;
				    background-color: var(--lightestColour);
					color: var(--darkColour);
					margin: 1rem 0;
					position: relative;
					border-radius: 0.3rem;
					text-decoration: none;
					box-shadow: 0 1px 3px rgba(41, 117, 209, 0.12),
						0 1px 2px rgba(41, 117, 209, 0.24);
					transition: box-shadow 0.2s;

					:hover {
					    opacity: 1 !important;
						box-shadow: 0px 2px 4px -1px rgba(41, 117, 209, 0.2), 0px 4px 5px 0px rgba(41, 117, 209, 0.14), 0px 1px 10px 0px rgba(41, 117, 209, 0.12);
}
					}

				`}>
				<div css="width: 100%; img { font-size: 150%}}">
					{icônes && emoji(icônes + ' ')}
				</div>
				<span css="width: 100%">{title}</span>
				{!hasFormule && (
					<>
						<div css="visibility: hidden">placeholder</div>
						<div
							css={`
								position: absolute;
								border-bottom-left-radius: 0.3rem;
								border-bottom-right-radius: 0.3rem;
								bottom: 0;
								left: 0;
								width: 100%;
								background: var(--colour);
								color: white;
								font-size: 80%;
							`}>
							prochainement !
						</div>
					</>
				)}
			</li>
		</Link>
	)
}
