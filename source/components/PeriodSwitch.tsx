import { updateUnit } from 'Actions/actions'
import { parseUnit, serializeUnit } from 'Engine/units'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { targetUnitSelector } from 'Selectors/simulationSelectors'
import './PeriodSwitch.css'

export default function PeriodSwitch() {
	const dispatch = useDispatch()
	const language = useTranslation().i18n.language
	const currentUnit = useSelector(targetUnitSelector)

	const units = ['€/mois', '€/an']
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
						<span>{serializeUnit(parseUnit(unit), 1, language)}</span>
					</label>
				))}
			</span>
		</span>
	)
}
