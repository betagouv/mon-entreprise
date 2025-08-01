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
		<Grid
			container
			style={{
				alignItems: 'baseline',
				justifyContent: 'space-between',
			}}
			spacing={2}
			as="fieldset"
		>
			<Grid item md="auto" sm={9} xs={8}>
				<TitreObjectif noWrap={true}>
					<legend>{t('periode-calcul', 'Période de calcul')}</legend>
				</TitreObjectif>
			</Grid>

			<Grid item>
				<PeriodSwitchToggleGroup
					value={currentUnit}
					onChange={onChange}
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
				</PeriodSwitchToggleGroup>
			</Grid>
		</Grid>
	)
}

const PeriodSwitchToggleGroup = styled(ToggleGroup)`
	input + span {
		background: none !important;
		border: none !important;
	}
`
