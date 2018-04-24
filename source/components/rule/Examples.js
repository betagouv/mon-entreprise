import React, { Component } from 'react'
import { evolve, path, isEmpty, compose } from 'ramda'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { disambiguateExampleSituation, collectDefaults } from 'Engine/rules.js'
import { analyse } from 'Engine/traverse'
import './Examples.css'
import { assume } from '../../reducers'
import { setExample } from '../../actions'

export let exampleSituationGateWithDefaults = (situationObject, rules) =>
	assume(() => name => situationObject[name], collectDefaults(rules))()

// By luck this works as expected for both null and undefined, * but with different branches failing :O *
export let isFloat = n => Number(n) === n && n % 1 !== 0

// les variables dans les tests peuvent être exprimées relativement à l'espace de nom de la règle,
// comme dans sa formule
export let runExamples = (examples, rule, parsedRules) =>
	examples
		.map(evolve({ situation: disambiguateExampleSituation(parsedRules, rule) }))
		.map(ex => {
			let runExample = analyse(parsedRules, rule.dottedName)(
					exampleSituationGateWithDefaults(ex.situation, parsedRules)
				),
				exampleValue = runExample.targets[0].nodeValue,
				goal = ex['valeur attendue'],
				ok =
					exampleValue === goal
						? true
						: typeof goal === 'number'
							? Math.abs((exampleValue - goal) / goal) < 0.001
							: goal === null && exampleValue === 0

			return {
				...ex,
				ok,
				rule: runExample.targets[0]
			}
		})

@connect(
	state => ({
		situationGate: state.situationGate,
		colour: state.themeColours.colour
	}),
	dispatch => ({
		setExample: compose(dispatch, setExample)
	})
)
export default class Examples extends Component {
	render() {
		let {
				situationExists,
				rule,
				colour,
				setExample,
				currentExample
			} = this.props,
			{ exemples = [] } = rule,
			examples = runExamples(exemples, rule, window.parsedRules)

		if (!examples.length) return null
		return (
			<div id="examples">
				<h2>
					Exemples de calcul{' '}
					<small>Cliquez sur un exemple pour le tester</small>
				</h2>
				{isEmpty(examples) ? (
					<p>
						<i className="fa fa-exclamation-triangle" aria-hidden="true" />
						<em>Cette règle manque d'exemples...</em>
					</p>
				) : (
					<ul>
						{examples.map(
							({ nom, ok, rule, 'valeur attendue': expected, situation }) => (
								<li
									key={nom}
									className={classNames('example', {
										ok,
										selected: currentExample && currentExample.name == nom
									})}
									onClick={() =>
										currentExample
											? setExample(null)
											: setExample(nom, situation)
									}
								>
									<span>
										{' '}
										{ok ? (
											<i className="fa fa-check-circle" aria-hidden="true" />
										) : (
											<i className="fa fa-times" aria-hidden="true" />
										)}
									</span>
									<span className="name">{nom}</span>
									{!ok &&
										currentExample &&
										currentExample.name == nom && (
											<div className="ko">
												Ce test ne passe pas
												<span>
													: le résultat attendu était{' '}
													<span className="expected">{expected}</span>
												</span>
											</div>
										)}
								</li>
							)
						)}
					</ul>
				)}
				{situationExists &&
					currentExample && (
						<div>
							<button
								id="injectSituation"
								onClick={() => setExample(null)}
								style={{ background: colour }}
							>
								Revenir à votre situation
							</button>
						</div>
					)}
			</div>
		)
	}
}
