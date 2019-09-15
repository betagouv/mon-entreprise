import { findRuleByDottedName } from 'Engine/rules'
import React, { useCallback, useEffect } from 'react'
import { Trans } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import {
	flatRulesSelector,
	situationSelector
} from 'Selectors/analyseSelectors'
import './PeriodSwitch.css'

export default function PeriodSwitch() {
	const dispatch = useDispatch()
	const rules = useSelector(flatRulesSelector)
	const situation = useSelector(situationSelector)
	const initialPeriod = useSelector(
		state => state.simulation?.config?.situation?.période
	)
	const currentPeriod = situation.période
	useEffect(() => {
		!currentPeriod && updatePeriod(initialPeriod || 'année')
	}, [currentPeriod, initialPeriod, updatePeriod])
	const updatePeriod = useCallback(
		toPeriod => {
			const needConversion = Object.keys(situation).filter(dottedName => {
				const rule = findRuleByDottedName(rules, dottedName)
				return rule?.période === 'flexible'
			})
			dispatch({ type: 'UPDATE_PERIOD', toPeriod, needConversion })
		},
		[dispatch, rules, situation]
	)
	const periods = ['mois', 'année']

	return (
		<span id="PeriodSwitch">
			<span className="base ui__ small toggle">
				{periods.map(period => (
					<label key={period}>
						<input
							name="période"
							type="radio"
							value={period}
							onChange={() => updatePeriod(period)}
							checked={currentPeriod === period}
						/>
						<span>
							<Trans>{period}</Trans>
						</span>
					</label>
				))}
			</span>
		</span>
	)
}
