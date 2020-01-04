import searchWeights from 'Components/searchWeights'
import { encodeRuleName } from 'Engine/rules'
import Fuse from 'fuse.js'
import { apply, concat, has, partition, pick, pipe } from 'ramda'
import React, { useEffect, useState } from 'react'
import emoji from 'react-easy-emoji'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { flatRulesSelector } from 'Selectors/analyseSelectors'
import ItemCard from './ItemCard'

let ItemCardWithoutData = ItemCard()
let buildFuse = rules =>
	new Fuse(rules.map(pick(['title', 'description', 'name', 'dottedName'])), {
		keys: searchWeights,
		threshold: 0.3
	})

export default connect(state => ({ rules: flatRulesSelector(state) }))(
	({ input, rules }) => {
		let exposedRules = rules.filter(rule => rule?.exposé === 'oui')

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
						{filteredRules.map(rule => {
							return (
								<li css="list-style-type: none" key={rule.dottedName}>
									<Link
										to={
											rule.formule != null
												? '/simulateur/' + encodeRuleName(rule.dottedName)
												: '#'
										}
										css={`
											text-decoration: none !important;
											:hover {
												opacity: 1 !important;
											}
										`}
									>
										<ItemCardWithoutData {...rule} />
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
