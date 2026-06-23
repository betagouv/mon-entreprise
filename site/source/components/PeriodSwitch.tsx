import { Key, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { styled } from 'styled-components'

import { Grid, RadioChoiceGroup, TitreObjectif } from '@/design-system'
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
		<GridCentered>
			<Grid item>
				<TitreObjectif noWrap={true}>
					<LegendBigger id="periode-calcul-label">
						{t('pages.simulateurs.commun.periode-calcul', 'Période de calcul')}
					</LegendBigger>
				</TitreObjectif>
			</Grid>

			<Grid item>
				<RadioChoiceGroup
					value={currentUnit}
					onChange={onChange}
					aria={{ labelledby: 'periode-calcul-label' }}
					options={periodsValue.map(({ label, unit }) => ({
						key: unit,
						value: unit,
						label,
					}))}
				/>
			</Grid>
		</GridCentered>
	)
}

const GridCentered = styled.fieldset`
	position: relative;
	z-index: 1;
	display: grid;
	grid-template-columns: 1.15fr 1fr;
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
