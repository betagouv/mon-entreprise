import React, { Component } from 'react'
import { Trans, translate } from 'react-i18next'
import { evolve, path, isEmpty, compose } from 'ramda'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { disambiguateExampleSituation, collectDefaults } from 'Engine/rules.js'
import { analyse } from 'Engine/traverse'
import './Examples.css'
import { assume } from '../../reducers/reduceSteps'
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
		parsedRules: state.parsedRules,
		colour: state.themeColours.colour
	}),
	dispatch => ({
		setExample: compose(dispatch, setExample)
	})
)
@translate()
export default class Examples extends Component {
	render() {
		let {
				situationExists,
				rule,
				parsedRules,
				colour,
				setExample,
				currentExample
			} = this.props,
			{ exemples = [] } = rule,
			examples = runExamples(exemples, rule, parsedRules)

		if (!examples.length) return null
		return (
			<div id="examples">
				<h2>
					<Trans i18nKey="examples">Exemples de calcul</Trans>{' '}
					<small><Trans i18nKey="clickexample">Cliquez sur un exemple pour le tester</Trans></small>
				</h2>
				{!isEmpty(examples) && (
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
										currentExample && currentExample.name == nom
											? setExample(null)
											: setExample(nom, situation)
									}>
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
												<Trans i18nKey="fail">Ce test ne passe pas</Trans>
												<span>
													: <Trans i18nKey="expected">le résultat attendu était</Trans>{' '}
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
								style={{ background: colour }}>
								<Trans i18nKey="cancelExample">Revenir à votre situation</Trans>
							</button>
						</div>
					)}
			</div>
		)
	}
}
