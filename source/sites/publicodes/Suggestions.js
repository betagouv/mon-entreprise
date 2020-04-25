import { encodeRuleName, findRuleByDottedName } from 'Engine/rules'
import { apply, concat, has, partition, pick, pipe } from 'ramda'
import React, { useEffect, useState } from 'react'
import emoji from 'react-easy-emoji'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { flatRulesSelector } from 'Selectors/analyseSelectors'
import ItemCard from './ItemCard'
import catégorie from './catégorie'
import Worker from 'worker-loader!./Suggestions.worker.js'
const worker = new Worker()
import Search from './Search'

let ItemCardWithoutData = ItemCard()

export default connect(state => ({ rules: flatRulesSelector(state) }))(
	({ rules }) => {
		let exposedRules = rules.filter(rule => rule?.exposé === 'oui')
		let [results, setResults] = useState(exposedRules)
		let [input, setInput] = useState(null)

		useEffect(() => {
			worker.postMessage({
				rules: Object.values(exposedRules).map(
					pick(['title', 'description', 'name', 'dottedName'])
				)
			})

			worker.onmessage = ({ data: results }) => setResults(results)
		}, [exposedRules, rules])

		return (
			<section style={{ marginTop: '2rem' }}>
				<Search
					setInput={input => {
						setInput(input)
						worker.postMessage({ input })
					}}
				/>
				{input &&
					(results.length ? (
						<>
							<h2 css="font-size: 100%;">Résultats :</h2>

							<RuleList {...{ rules: results, exposedRules }} />
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
