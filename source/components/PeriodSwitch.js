import { updatePeriod } from 'Actions/actions'
import React from 'react'
import { Trans } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { situationSelector } from 'Selectors/analyseSelectors'
import './PeriodSwitch.css'

export default function PeriodSwitch() {
	const dispatch = useDispatch()
	const situation = useSelector(situationSelector)
	const defaultPeriod = useSelector(
		state => state.simulation?.config?.situation?.période || 'année'
	)
	const currentPeriod = situation.période
	let periods = ['année', 'mois']

	if (!currentPeriod) {
		dispatch(updatePeriod(defaultPeriod))
	}

	return (
		<span id="PeriodSwitch">
			<span className="base ui__ small toggle">
				{periods.map(period => (
					<label key={period}>
						<input
							name="période"
							type="radio"
							value={period}
							onChange={() => dispatch(updatePeriod(period))}
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
