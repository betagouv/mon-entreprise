import { Key, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { SimulationGoalRadio } from '@/components/Simulation/SimulationGoalRadio'
import { updateUnit } from '@/store/actions/actions'
import { targetUnitSelector } from '@/store/selectors/simulation/targetUnit.selector'

type Props = {
	periods?: Array<{
		label: string
		unit: string
	}>
}

export default function PeriodSwitch({ periods }: Props) {
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
		(unit: Key) => {
			dispatch(updateUnit(unit as string))
		},
		[dispatch]
	)

	return (
		<SimulationGoalRadio
			titre={t('pages.simulateurs.commun.periode-calcul', 'Période de calcul')}
			value={currentUnit}
			options={periodsValue.map(({ label, unit }) => ({
				key: unit,
				value: unit,
				label,
			}))}
			onChange={onChange}
		/>
	)
}
