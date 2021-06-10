import { updateUnit } from 'Actions/actions'
import { Trans } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { targetUnitSelector } from 'Selectors/simulationSelectors'
import { useTranslation } from 'react-i18next'
import './PeriodSwitch.css'

export default function PeriodSwitch() {
	const dispatch = useDispatch()

	const currentUnit = useSelector(targetUnitSelector)
	const { t } = useTranslation()

	const periods = [
		{
			label: t('Mensuel'),
			unit: '€/mois',
		},
		{
			label: t('Annuel'),
			unit: '€/an',
		},
	]
	return (
		<div id="PeriodSwitch">
			<span className="base ui__ small radio toggle">
				{periods.map(({ label, unit }) => (
					<label key={unit} className={ currentUnit !== unit ? 'print-display-none' : ''}>
						<input
							name="defaultUnit"
							type="radio"
							value={unit}
							onChange={() => dispatch(updateUnit(unit))}
							checked={currentUnit === unit}
						/>
						<span>
							<Trans>{label}</Trans>
						</span>
					</label>
				))}
			</span>
		</div>
	)
}
