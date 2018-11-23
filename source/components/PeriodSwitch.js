import React from 'react'
import { Trans, translate } from 'react-i18next'
import { Field } from 'redux-form'
import './PeriodSwitch.css'
import { reduxForm, change } from 'redux-form'
import { compose, map, filter, toPairs } from 'ramda'
import emoji from 'react-easy-emoji'
import { batchActions } from 'redux-batched-actions'
import { connect } from 'react-redux'
import {
	situationSelector,
	flatRulesSelector
} from 'Selectors/analyseSelectors'
import { findRuleByDottedName, nestedSituationToPathMap } from 'Engine/rules'

export default compose(
	reduxForm({
		form: 'conversation',
		destroyOnUnmount: false,
		initialValues: { période: 'mois' }
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
					onChange={e =>
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
					onChange={e =>
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
	let needConversation = filter(([dottedName, value]) => {
		let rule = findRuleByDottedName(rules, dottedName)
		return value != null && rule.période === 'flexible'
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
			needConversation
		),
		change('conversation', 'période', toPeriod)
	]

	batchPeriodChange(actions)
}
