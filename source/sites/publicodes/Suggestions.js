import searchWeights from 'Components/searchWeights'
import { encodeRuleName, findRuleByDottedName } from 'Engine/rules'
import Fuse from 'fuse.js'
import { apply, concat, has, partition, pick, pipe } from 'ramda'
import React, { useEffect, useState } from 'react'
import emoji from 'react-easy-emoji'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { flatRulesSelector } from 'Selectors/analyseSelectors'
import ItemCard from './ItemCard'
import catégorie from './catégorie'

let ItemCardWithoutData = ItemCard()
let buildFuse = rules =>
	new Fuse(rules.map(pick(['title', 'description', 'name', 'dottedName'])), {
		keys: searchWeights,
		threshold: 0.3
	})

export default connect(state => ({ rules: flatRulesSelector(state) }))(
	({ input, rules }) => {
		let [fuse, setFuse] = useState(null)
		let exposedRules = rules.filter(rule => rule?.exposé === 'oui')
		useEffect(() => {
			setFuse(buildFuse(exposedRules))
		}, [exposedRules])

		let filteredRules = fuse && fuse.search(input)

		return (
			<section style={{ marginTop: '2rem' }}>
				{input &&
					(filteredRules.length ? (
						<>
							<h2 css="font-size: 100%;">Résultats :</h2>

							<RuleList {...{ rules: filteredRules, exposedRules }} />
						</>
					) : (
						<p>Rien trouvé {emoji('😶')}</p>
					))}
				<RuleList {...{ rules: exposedRules, exposedRules }} />
			</section>
		)
	}
)

const RuleList = ({ rules, exposedRules }) => (
	<ul css="display: flex; flex-wrap: wrap; justify-content: space-evenly;     ">
		{rules.map(({ dottedName }) => {
			let rule = findRuleByDottedName(exposedRules, dottedName)
			return (
				<li css="list-style-type: none" key={rule.dottedName}>
					<Link
						to={'/simulateur/' + encodeRuleName(rule.dottedName)}
						css={`
							text-decoration: none !important;
							:hover {
								opacity: 1 !important;
							}
						`}
					>
						{catégorie(rule)}
						<ItemCardWithoutData {...rule} />
					</Link>
				</li>
			)
		})}
	</ul>
)
