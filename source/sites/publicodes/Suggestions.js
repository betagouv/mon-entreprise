import { React, emoji } from 'Components'
import { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { flatRulesSelector } from 'Selectors/analyseSelectors'
import Fuse from 'fuse.js'
import searchWeights from 'Components/searchWeights'
import { pick, pipe, concat, partition, has, apply } from 'ramda'
import { findRuleByDottedName } from 'Engine/rules'
import ItemCard from './ItemCard'
import { Link } from 'react-router-dom'
import { encodeRuleName } from 'Engine/rules'

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
						{filteredRules.map(({ dottedName }) => {
							let rule = findRuleByDottedName(rules, dottedName)
							return (
								<li css="list-style-type: none" key={dottedName}>
									<Link
										to={
											rule.formule != null
												? '/simulateur/' + encodeRuleName(dottedName)
												: '#'
										}
										css={`
											text-decoration: none !important;
											:hover {
												opacity: 1 !important;
											}
										`}>
										<ItemCard {...rule} showHumanCarbon={false} />
									</Link>
								</li>
							)
						})}
					</ul>
				)}
			</section>
		)
	}
)
