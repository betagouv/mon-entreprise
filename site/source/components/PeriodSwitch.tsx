import { Trans, useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { updateUnit } from '@/actions/actions'
import { Radio, ToggleGroup } from '@/design-system/field'
import { targetUnitSelector } from '@/selectors/simulationSelectors'

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
		<div>
			<ToggleGroup
				value={currentUnit}
				onChange={(unit: string) => dispatch(updateUnit(unit))}
			>
				{periods.map(({ label, unit }) => (
					<span
						key={unit}
						className={currentUnit !== unit ? 'print-hidden' : ''}
					>
						<Radio value={unit}>
							<Trans>{label}</Trans>
						</Radio>
					</span>
				))}
			</ToggleGroup>
		</div>
	)
}
