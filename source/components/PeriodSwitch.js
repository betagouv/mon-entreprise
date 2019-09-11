import { findRuleByDottedName, nestedSituationToPathMap } from 'Engine/rules'
import { compose, filter, map, toPairs } from 'ramda'
import React, { useEffect } from 'react'
import { Trans, withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { batchActions } from 'redux-batched-actions'
import { change, Field, reduxForm } from 'redux-form'
import {
	flatRulesSelector,
	situationSelector,
	situationsWithDefaultsSelector
} from 'Selectors/analyseSelectors'
import './PeriodSwitch.css'

export default compose(
	reduxForm({
		form: 'conversation',
		destroyOnUnmount: false
	}),
	withTranslation(),
	connect(
		state => {
			let situation = situationsWithDefaultsSelector(state)
			if (Array.isArray(situation)) {
				situation = situation[0]
			}

			return {
				rules: flatRulesSelector(state),
				situation: nestedSituationToPathMap(situationSelector(state)),
				initialPériode: situation.période
			}
		},
		dispatch => ({
			batchPeriodChange: actions => dispatch(batchActions(actions))
		})
	)
)(function PeriodSwitch({
	situation,
	rules,
	batchPeriodChange,
	initialPériode
}) {
	useEffect(() => {
		!situation.période &&
			updateSituation(
				initialPériode || 'année',
				batchPeriodChange,
				situation,
				rules
			)
		return
	})
	return (
		<span id="PeriodSwitch">
			<span className="base ui__ small toggle">
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
					<span>
						<Trans>année</Trans>
					</span>
				</label>
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
					<span>
						<Trans>mois</Trans>
					</span>
				</label>
			</span>
		</span>
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
							: (function() {
									throw new Error('Oups, changement de période invalide')
							  })()
					) + ''
				),
			needConvertion
		),
		change('conversation', 'période', toPeriod)
	]

	batchPeriodChange(actions)
}
