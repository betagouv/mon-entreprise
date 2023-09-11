import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { Radio, ToggleGroup } from '@/design-system/field'
import { updateUnit } from '@/store/actions/actions'
import { targetUnitSelector } from '@/store/selectors/simulationSelectors'

export default function PeriodSwitch() {
	const dispatch = useDispatch()

	const currentUnit = useSelector(targetUnitSelector)
	const { t } = useTranslation()
	const periods = [
		{
			label: t('Montant mensuel'),
			unit: '€/mois',
		},
		{
			label: t('Montant annuel'),
			unit: '€/an',
		},
	]

	return (
		<div>
			<ToggleGroup
				value={currentUnit}
				onChange={(unit: string) => dispatch(updateUnit(unit))}
				mode="tab"
				hideRadio
				aria-label={t("Mode d'affichage")}
			>
				{periods.map(({ label, unit }) => (
					<span
						key={unit}
						className={currentUnit !== unit ? 'print-hidden' : ''}
					>
						<Radio value={unit}>{label}</Radio>
					</span>
				))}
			</ToggleGroup>
		</div>
	)
}
