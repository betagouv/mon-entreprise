import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { styled } from 'styled-components'

import { Grid, Radio, TitreObjectif, ToggleGroup } from '@/design-system'
import { updateUnit } from '@/store/actions/actions'
import { targetUnitSelector } from '@/store/selectors/simulationSelectors'

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
		<GridCentered>
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

const GridCentered = styled.fieldset`
	display: grid;
	grid-template-columns: 1.25fr 1fr;
	gap: ${({ theme }) => theme.spacings.md};

	& > div {
		padding: 0;
		text-align: right;
		margin-right: ${({ theme }) => theme.spacings.xxs};
	}

	@media (max-width: ${({ theme }) => theme.breakpointsWidth.sm}) {
		grid-template-columns: 1fr;
		gap: ${({ theme }) => theme.spacings.xs};
		margin-left: -${({ theme }) => theme.spacings.xs} !important;

		& > div {
			text-align: left;
		}
	}
`

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
