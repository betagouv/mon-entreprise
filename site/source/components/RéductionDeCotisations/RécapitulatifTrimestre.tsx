import { sumAll } from 'effect/Number'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import Montant from '@/components/RéductionDeCotisations/Montant'
import { Body, Grid } from '@/design-system'
import { MonthState } from '@/utils/réductionDeCotisations'
import { normalizeRuleName } from '../utils/normalizeRuleName'

type Props = {
	label: string
	data: MonthState[]
	codeRéduction?: string
	codeRégularisation?: string
	withRépartitionAndRégularisation?: boolean
	mobileVersion?: boolean
}

export type RémunérationBruteInput = {
	unité: string
	valeur: number
}

export default function RécapitulatifTrimestre({
	label,
	data,
	codeRéduction,
	codeRégularisation,
	withRépartitionAndRégularisation = true,
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
					monthData.réduction.répartition.IRC +
					monthData.régularisation.répartition.IRC
			)
		),
		Urssaf: sumAll(
			data.map(
				(monthData) =>
					monthData.réduction.répartition.Urssaf +
					monthData.régularisation.répartition.Urssaf
			)
		),
		chômage: sumAll(
			data.map(
				(monthData) =>
					monthData.réduction.répartition.chômage +
					monthData.régularisation.répartition.chômage
			)
		),
	}
	let réduction = sumAll(data.map((monthData) => monthData.réduction.value))
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

	const normalizedLabel = normalizeRuleName(label)

	const MontantRéduction = () => {
		return (
			<Montant
				id={`recap-${normalizedLabel}-réduction`}
				rémunérationBrute={rémunération}
				réduction={réduction}
				répartition={répartition}
				displayedUnit={displayedUnit}
				language={language}
				alignment="center"
				withRépartition={withRépartitionAndRégularisation}
			/>
		)
	}

	const MontantRégularisation = () => {
		return (
			<Montant
				id={`recap-${normalizedLabel}-régularisation`}
				rémunérationBrute={rémunération}
				réduction={régularisation}
				répartition={répartition}
				displayedUnit={displayedUnit}
				language={language}
				alignment="center"
				withRépartition={withRépartitionAndRégularisation}
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
							'pages.simulateurs.réduction-générale.recap.header-réduction',
							'Réduction calculée'
						)}
						{codeRéduction && (
							<>
								<br />
								{codeRéduction}
							</>
						)}
					</StyledBody>
				</Grid>
				<Grid item>
					<StyledBody>
						<MontantRéduction />
					</StyledBody>
				</Grid>
			</GridContainer>

			{withRépartitionAndRégularisation && (
				<GridContainer container spacing={2}>
					<Grid item>
						<StyledBody>
							{t(
								'pages.simulateurs.réduction-générale.recap.header-régularisation',
								'Régularisation calculée'
							)}
							{codeRégularisation && (
								<>
									<br />
									{codeRégularisation}
								</>
							)}
						</StyledBody>
					</Grid>
					<Grid item>
						<StyledBody>
							<MontantRégularisation />
						</StyledBody>
					</Grid>
				</GridContainer>
			)}
		</div>
	) : (
		<tr>
			<th scope="row">{label}</th>
			<td>
				<MontantRéduction />
			</td>
			{withRépartitionAndRégularisation && (
				<td>
					<MontantRégularisation />
				</td>
			)}
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
