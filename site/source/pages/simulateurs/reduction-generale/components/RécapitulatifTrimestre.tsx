import { sumAll } from 'effect/Number'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { Grid } from '@/design-system/layout'
import { Body } from '@/design-system/typography/paragraphs'

import { MonthState } from '../utils'
import MontantRéduction from './MontantRéduction'

type Props = {
	label: string
	data: MonthState[]
	mobileVersion?: boolean
}

export type RémunérationBruteInput = {
	unité: string
	valeur: number
}

export default function RécapitulatifTrimestre({
	label,
	data,
	mobileVersion = false,
}: Props) {
	const { t, i18n } = useTranslation()
	const language = i18n.language
	const displayedUnit = '€'

	const rémunération = sumAll(
		data.map((monthData) => monthData.rémunérationBrute)
	)
	const répartition = {
		IRC: sumAll(
			data.map(
				(monthData) =>
					monthData.réductionGénérale.répartition.IRC +
					monthData.régularisation.répartition.IRC
			)
		),
		Urssaf: sumAll(
			data.map(
				(monthData) =>
					monthData.réductionGénérale.répartition.Urssaf +
					monthData.régularisation.répartition.Urssaf
			)
		),
		chômage: sumAll(
			data.map(
				(monthData) =>
					monthData.réductionGénérale.répartition.chômage +
					monthData.régularisation.répartition.chômage
			)
		),
	}
	let réduction = sumAll(
		data.map((monthData) => monthData.réductionGénérale.value)
	)
	let régularisation = sumAll(
		data.map((monthData) => monthData.régularisation.value)
	)
	if (réduction + régularisation > 0) {
		réduction += régularisation
		régularisation = 0
	} else {
		régularisation += réduction
		réduction = 0
	}

	const Montant671 = () => {
		return (
			<MontantRéduction
				rémunérationBrute={rémunération}
				réductionGénérale={réduction}
				répartition={répartition}
				displayedUnit={displayedUnit}
				language={language}
				displayNull={false}
				alignment="center"
			/>
		)
	}

	const Montant801 = () => {
		return (
			<MontantRéduction
				rémunérationBrute={rémunération}
				réductionGénérale={régularisation}
				répartition={répartition}
				displayedUnit={displayedUnit}
				language={language}
				displayNull={false}
				alignment="center"
			/>
		)
	}

	return mobileVersion ? (
		<div>
			<StyledMonth>{label}</StyledMonth>
			<GridContainer container spacing={2}>
				<Grid item>
					<StyledBody>
						{t(
							'pages.simulateurs.réduction-générale.recap.header',
							'Réduction calculée'
						)}
						<br />
						{t(
							'pages.simulateurs.réduction-générale.recap.code671',
							'code 671(€)'
						)}
					</StyledBody>
				</Grid>
				<Grid item>
					<StyledBody>
						<Montant671 />
					</StyledBody>
				</Grid>
			</GridContainer>

			<GridContainer container spacing={2}>
				<Grid item>
					<StyledBody>
						{t(
							'pages.simulateurs.réduction-générale.recap.header',
							'Réduction calculée'
						)}
						<br />
						{t(
							'pages.simulateurs.réduction-générale.recap.code801',
							'code 801(€)'
						)}
					</StyledBody>
				</Grid>
				<Grid item>
					<StyledBody>
						<Montant801 />
					</StyledBody>
				</Grid>
			</GridContainer>
		</div>
	) : (
		<tr>
			<th scope="row">{label}</th>
			<td>
				<Montant671 />
			</td>
			<td>
				<Montant801 />
			</td>
		</tr>
	)
}

const StyledMonth = styled(Body)`
	font-weight: bold;
	text-transform: capitalize;
	border-bottom: solid 1px ${({ theme }) => theme.colors.bases.primary[100]};
`
const GridContainer = styled(Grid)`
	align-items: center;
	justify-content: space-between;
`
const StyledBody = styled(Body)`
	margin-top: 0;
`
