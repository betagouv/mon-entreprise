import { findRuleByDottedName, nestedSituationToPathMap } from 'Engine/rules'
import { compose, filter, map, toPairs } from 'ramda'
import React from 'react'
import emoji from 'react-easy-emoji'
import { Trans, translate } from 'react-i18next'
import { connect } from 'react-redux'
import { batchActions } from 'redux-batched-actions'
import { change, Field, reduxForm } from 'redux-form'
import {
	flatRulesSelector,
	situationSelector
} from 'Selectors/analyseSelectors'
import './PeriodSwitch.css'

export default compose(
	reduxForm({
		form: 'conversation',
		destroyOnUnmount: false,
		initialValues: { période: 'année' }
	}),
	translate(),
	connect(
		state => ({
			rules: flatRulesSelector(state),
			situation: nestedSituationToPathMap(situationSelector(state))
		}),
		dispatch => ({
			batchPeriodChange: actions => dispatch(batchActions(actions))
		})
	)
)(function PeriodSwitch({ situation, rules, batchPeriodChange }) {
	return (
		<div id="PeriodSwitch">
			<label>
				<Field
					name="période"
					component="input"
					type="radio"
					value="mois"
					onChange={() =>
						updateSituation('mois', batchPeriodChange, situation, rules)
					}
				/>
				<span />
				<span className="radioText">
					<Trans>Mois</Trans>
				</span>
			</label>
			<span style={{ fontSize: '1.5em' }}>{emoji('⏳')}</span>
			<label>
				<Field
					name="période"
					component="input"
					type="radio"
					value="année"
					onChange={() =>
						updateSituation('année', batchPeriodChange, situation, rules)
					}
				/>
				<span />

				<span className="radioText">
					<Trans>Année</Trans>
				</span>
			</label>
		</div>
	)
})

let updateSituation = (toPeriod, batchPeriodChange, situation, rules) => {
	let needConvertion = filter(([dottedName, value]) => {
		let rule = findRuleByDottedName(rules, dottedName)
		return value != null && rule?.période === 'flexible'
	})(toPairs(situation))
	let actions = [
		...map(
			([dottedName, value]) =>
				change(
					'conversation',
					dottedName,
					Math.round(
						situation.période === 'mois' && toPeriod === 'année'
							? value * 12
							: situation.période === 'année' && toPeriod === 'mois'
							? value / 12
							: do {
									throw new Error('Oups, changement de période invalide')
							  }
					)
				),
			needConvertion
		),
		change('conversation', 'période', toPeriod)
	]
	console.log({ actions })

	batchPeriodChange(actions)
}
