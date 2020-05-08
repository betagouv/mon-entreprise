import { encodeRuleName, findRuleByDottedName } from 'Engine/rules'
import { apply, concat, has, partition, pick, pipe } from 'ramda'
import React, { useEffect, useState } from 'react'
import emoji from 'react-easy-emoji'
import { connect, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { flatRulesSelector } from 'Selectors/analyseSelectors'
import ItemCard from './ItemCard'
import byCategory from './catégories'
import Worker from 'worker-loader!./Suggestions.worker.js'
const worker = new Worker()
import Search from './Search'

let ItemCardWithoutData = ItemCard()

export default function Suggestions() {
	const rules = useSelector(flatRulesSelector)
	let exposedRules = rules.filter((rule) => rule?.exposé === 'oui')
	let [results, setResults] = useState(exposedRules)
	let [input, setInput] = useState(null)

	useEffect(() => {
		worker.postMessage({
			rules: Object.values(exposedRules).map(
				pick(['title', 'description', 'name', 'dottedName'])
			),
		})

		worker.onmessage = ({ data: results }) => setResults(results)
	}, [])

	return (
		<section>
			<Search
				setInput={(input) => {
					setInput(input)
					if (input.length > 2) worker.postMessage({ input })
				}}
			/>
			<section style={{ marginTop: '1.3rem' }}>
				{input ? (
					results.length ? (
						<>
							<h2 css="font-size: 100%;">Résultats :</h2>

							<RuleList {...{ rules: results, exposedRules }} />
						</>
					) : (
						<p>Rien trouvé {emoji('😶')}</p>
					)
				) : (
					<CategoryView exposedRules={exposedRules} />
				)}
			</section>
		</section>
	)
}

const CategoryView = ({ exposedRules }) => {
	const categories = byCategory(exposedRules)
	return (
		<ul
			css={`
				padding-left: 0;
				list-style: none;
				li {
				}
				> li > div {
					text-transform: uppercase;
					font-size: 85%;
					width: auto;
					margin: 0 auto;
					text-align: center;
					border-radius: 0.3rem;
					width: 6.5rem;
					color: var(--textColor);
					background: var(--color);
				}
				li > ul > li {
					white-space: initial;
					display: inline-block;
				}
				li > ul {
					padding-left: 0;
				}

				@media (max-width: 600px) {
					li > ul {
						display: block;
						white-space: nowrap;
						overflow-x: auto;
					}
					li > ul > li {
						margin: 0 1rem;
					}
				}
			`}
		>
			{categories.map(([category, rules], i) => (
				<li>
					<div>{category}</div>
					<RuleList {...{ rules, exposedRules: rules }} />
					{i === 0 && (
						<img
							css={`
								display: none;
								height: 3em;
								margin: 1em auto;
								@media (max-width: 600px) {
									display: block;
								}
							`}
							src={require('./images/horizontal-scroll.png')}
						/>
					)}
				</li>
			))}
		</ul>
	)
}
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
						<ItemCardWithoutData {...rule} />
					</Link>
				</li>
			)
		})}
	</ul>
)
