import React, { Component } from 'react'
import { evolve, path, isEmpty } from 'ramda'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { disambiguateExampleSituation, collectDefaults } from 'Engine/rules.js'
import { analyse } from 'Engine/traverse'
import './Examples.css'
import { assume } from '../../reducers'

// By luck this works as expected for both null and undefined, * but with different branches failing :O *
export let isFloat = n => Number(n) === n && n % 1 !== 0

// les variables dans les tests peuvent être exprimées relativement à l'espace de nom de la règle,
// comme dans sa formule
export let runExamples = (examples, rule, parsedRules) =>
	examples
		.map(evolve({ situation: disambiguateExampleSituation(parsedRules, rule) }))
		.map(ex => {
			let exampleSituationGate = () => name => ex.situation[name]

			let runExample = analyse(parsedRules, rule.name)(
					assume(exampleSituationGate, collectDefaults(parsedRules))()
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

@connect(state => ({
	situationGate: state.situationGate,
	parsedRules: state.parsedRules
}))
export default class Examples extends Component {
	render() {
		let focusedExample = path(['focusedExample', 'nom'])(this.props),
			{ inject, situationExists, showValues, rule, parsedRules } = this.props,
			{ exemples = [] } = rule,
			examples = runExamples(exemples, rule, parsedRules)

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
						{examples.map(({ nom, ok, rule, 'valeur attendue': expected }) => (
							<li
								key={nom}
								className={classNames('example', {
									ok,
									selected: focusedExample == nom
								})}
								onClick={() => inject({ nom, ok, rule })}
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
									focusedExample == nom && (
										<div className="ko">
											Ce test ne passe pas
											{showValues && (
												<span>
													: le résultat attendu était{' '}
													<span className="expected">{expected}</span>
												</span>
											)}
										</div>
									)}
							</li>
						))}
					</ul>
				)}
				{situationExists &&
					focusedExample && (
						<div>
							<button id="injectSituation" onClick={() => inject()}>
								Revenir à votre situation
							</button>
						</div>
					)}
			</div>
		)
	}
}
