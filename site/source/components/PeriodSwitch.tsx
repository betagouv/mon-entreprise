import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { styled } from 'styled-components'

import { Grid, Radio, TitreObjectif, ToggleGroup } from '@/design-system'
import { updateUnit } from '@/store/actions/actions'
import { targetUnitSelector } from '@/store/selectors/simulationSelectors'

import { GridCentered } from './Simulation/ObjectifSaisissableDeSimulation'

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
		(unit: string) => {
			dispatch(updateUnit(unit))
		},
		[dispatch]
	)

	return (
		<GridCentered container spacing={2} as="fieldset">
			<Grid item>
				<TitreObjectif noWrap={true}>
					<LegendBigger>
						{t('periode-calcul', 'Période de calcul')}
					</LegendBigger>
				</TitreObjectif>
			</Grid>

			<Grid item>
				<PeriodSwitchToggleGroup
					value={currentUnit}
					onChange={onChange}
					aria-label={t('Période de calcul')}
				>
					{periodsValue.map(({ label, unit }) => (
						<span
							key={unit}
							className={currentUnit !== unit ? 'print-hidden' : ''}
						>
							<Radio value={unit}>{label}</Radio>
						</span>
					))}
				</PeriodSwitchToggleGroup>
			</Grid>
		</GridCentered>
	)
}

const LegendBigger = styled.legend`
	padding: 0.5rem 0 0;
	font-size: ${({ theme }) => theme.fontSizes.lg};
`
const PeriodSwitchToggleGroup = styled(ToggleGroup)`
	margin: 0 0 1.5rem;

	input {
		& + span {
			padding: 0.5rem 0.75rem 0.5rem 0 !important;
			border: 0 solid transparent !important;
			background: none !important;
		}
	}
`
