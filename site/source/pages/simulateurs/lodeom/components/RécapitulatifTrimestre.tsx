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
					monthData.lodeom.répartition.IRC +
					monthData.régularisation.répartition.IRC
			)
		),
		Urssaf: sumAll(
			data.map(
				(monthData) =>
					monthData.lodeom.répartition.Urssaf +
					monthData.régularisation.répartition.Urssaf
			)
		),
	}
	let réduction = sumAll(data.map((monthData) => monthData.lodeom.value))
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

	const MontantExonération = () => {
		return (
			<MontantRéduction
				id={`recap-${label.replace(/\s|\./g, '_')}-réduction`}
				rémunérationBrute={rémunération}
				lodeom={réduction}
				répartition={répartition}
				displayedUnit={displayedUnit}
				language={language}
				displayNull={false}
				alignment="center"
			/>
		)
	}

	const MontantRégularisation = () => {
		return (
			<MontantRéduction
				id={`recap-${label.replace(/\s|\./g, '_')}-régularisation`}
				rémunérationBrute={rémunération}
				lodeom={régularisation}
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
							'pages.simulateurs.lodeom.recap.header.réduction',
							'Réduction calculée'
						)}
						{/* <br />
						{t(
							'pages.simulateurs.lodeom.recap.code671',
							'code 671(€)'
						)} */}
					</StyledBody>
				</Grid>
				<Grid item>
					<StyledBody>
						<MontantExonération />
					</StyledBody>
				</Grid>
			</GridContainer>

			<GridContainer container spacing={2}>
				<Grid item>
					<StyledBody>
						{t(
							'pages.simulateurs.lodeom.recap.header.régularisation',
							'Régularisation calculée'
						)}
						{/* <br />
						{t(
							'pages.simulateurs.lodeom.recap.code801',
							'code 801(€)'
						)} */}
					</StyledBody>
				</Grid>
				<Grid item>
					<StyledBody>
						<MontantRégularisation />
					</StyledBody>
				</Grid>
			</GridContainer>
		</div>
	) : (
		<tr>
			<th scope="row">{label}</th>
			<td>
				<MontantExonération />
			</td>
			<td>
				<MontantRégularisation />
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
