import React from 'react'
import { Trans, translate } from 'react-i18next'
import classNames from 'classnames'
import { path, values } from 'ramda'
import { AttachDictionary } from '../AttachDictionary'
import knownMecanisms from 'Engine/known-mecanisms.yaml'
import { makeJsx } from 'Engine/evaluation'
import './Algorithm.css'
import { head } from 'ramda'
import { analyse } from 'Engine/traverse'
import { exampleSituationGateWithDefaults } from './Examples'
import withLanguage from '../withLanguage'

@AttachDictionary(knownMecanisms)
@translate()
@withLanguage
export default class Algorithm extends React.Component {
	render() {
		let {
				rule: displayedRule,
				showValues,
				currentExample,
				rules,
				language
			} = this.props,
			ruleWithoutFormula =
				!displayedRule['formule'] ||
				path(['formule', 'explanation', 'une possibilité'], displayedRule)
		let rule = currentExample
			? head(
					analyse(rules, displayedRule.dottedName)(
						exampleSituationGateWithDefaults(currentExample.situation, rules)
					).targets
			  )
			: displayedRule
		console.log(rule)

		return (
			<div id="algorithm">
				<section id="rule-rules" className={classNames({ showValues })}>
					{showValues && rule.nodeValue ? (
						<div id="ruleValue">
							<i className="fa fa-calculator" aria-hidden="true" />{' '}
							{Intl.NumberFormat(language, {
								style: 'currency',
								currency: 'EUR'
							}).format(rule.nodeValue)}
						</div>
					) : null}
					{do {
						// TODO ce let est incompréhensible !
						let applicabilityMecanisms = values(rule).filter(
							v => v && v['rulePropType'] == 'cond'
						)
						applicabilityMecanisms.length > 0 && (
							<section id="declenchement">
								<h2>
									<Trans>Déclenchement</Trans>
								</h2>
								<ul>
									{applicabilityMecanisms.map(v => (
										<li key={v.name}>{makeJsx(v)}</li>
									))}
								</ul>
							</section>
						)
					}}
					{!ruleWithoutFormula ? (
						<section id="formule">
							<h2>
								<Trans>Détails du calcul</Trans>
								<small>
									<Trans i18nKey="understand">
										Cliquez sur chaque chaque valeur pour comprendre
									</Trans>
								</small>
							</h2>
							{makeJsx(rule['formule'])}
						</section>
					) : null}
				</section>
			</div>
		)
	}
}
