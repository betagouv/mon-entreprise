import { updateUnit } from 'Actions/actions'
import { Trans } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { targetUnitSelector } from 'Selectors/simulationSelectors'
import './PeriodSwitch.css'

export default function PeriodSwitch() {
	const dispatch = useDispatch()
	const currentUnit = useSelector(targetUnitSelector)

	const units = ['€/mois', '€/an']
	return (
		<span id="PeriodSwitch">
			<span className="base ui__ small radio toggle">
				{units.map((unit) => (
					<label key={unit}>
						<input
							name="defaultUnit"
							type="radio"
							value={unit}
							onChange={() => dispatch(updateUnit(unit))}
							checked={currentUnit === unit}
						/>
						<span>
							<Trans>{unit}</Trans>
						</span>
					</label>
				))}
			</span>
		</span>
	)
}
