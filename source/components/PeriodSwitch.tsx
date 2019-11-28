import { updateUnit } from 'Actions/actions'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { defaultUnitsSelector } from 'Selectors/analyseSelectors'
import './PeriodSwitch.css'

export default function PeriodSwitch() {
	const dispatch = useDispatch()
	const currentUnit = useSelector(defaultUnitsSelector)[0]

	let units = ['€/mois', '€/an']

	return (
		<span id="PeriodSwitch">
			<span className="base ui__ small toggle">
				{units.map(unit => (
					<label key={unit}>
						<input
							name="defaultUnit"
							type="radio"
							value={unit}
							onChange={() => dispatch(updateUnit(unit))}
							checked={currentUnit === unit}
						/>
						<span>{unit}</span>
					</label>
				))}
			</span>
		</span>
	)
}
