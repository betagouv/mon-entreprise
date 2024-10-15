import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { Radio, ToggleGroup } from '@/design-system/field'
import { updateUnit } from '@/store/actions/actions'
import { targetUnitSelector } from '@/store/selectors/simulationSelectors'

type Props = {
	periods?: Array<{
		label: string
		unit: string
	}>
	onSwitch?: (unit: string) => void
}

export default function PeriodSwitch({ periods, onSwitch }: Props) {
	const dispatch = useDispatch()

	const currentUnit = useSelector(targetUnitSelector)
	const { t } = useTranslation()
	const defaultPeriods = [
		{
			label: t('Montant mensuel'),
			unit: '€/mois',
		},
		{
			label: t('Montant annuel'),
			unit: '€/an',
		},
	]
	const periodsValue = periods || defaultPeriods

	const onChange = useCallback(
		(unit: string) => {
			dispatch(updateUnit(unit))
			onSwitch?.(unit)
		},
		[dispatch, onSwitch]
	)

	return (
		<div>
			<ToggleGroup
				value={currentUnit}
				onChange={onChange}
				mode="tab"
				hideRadio
				aria-label={t("Mode d'affichage")}
			>
				{periodsValue.map(({ label, unit }) => (
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
