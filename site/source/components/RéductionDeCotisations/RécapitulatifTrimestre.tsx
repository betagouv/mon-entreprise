import { sumAll } from 'effect/Number'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import Montant from '@/components/RéductionDeCotisations/Montant'
import { Grid } from '@/design-system/layout'
import { Body } from '@/design-system/typography/paragraphs'
import { MonthState, RéductionDottedName } from '@/utils/réductionDeCotisations'

type Props = {
	dottedName: RéductionDottedName
	label: string
	data: MonthState[]
	codeRéduction?: string
	codeRégularisation?: string
	withRépartition?: boolean
	mobileVersion?: boolean
}

export type RémunérationBruteInput = {
	unité: string
	valeur: number
}

export default function RécapitulatifTrimestre({
	dottedName,
	label,
	data,
	codeRéduction,
	codeRégularisation,
	withRépartition = true,
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

	const MontantRéduction = () => {
		return (
			<Montant
				id={`recap-${label.replace(/\s|\./g, '_')}-réduction`}
				dottedName={dottedName}
				rémunérationBrute={rémunération}
				réduction={réduction}
				répartition={répartition}
				displayedUnit={displayedUnit}
				language={language}
				alignment="center"
				withRépartition={withRépartition}
			/>
		)
	}

	const MontantRégularisation = () => {
		return (
			<Montant
				id={`recap-${label.replace(/\s|\./g, '_')}-régularisation`}
				dottedName={dottedName}
				rémunérationBrute={rémunération}
				réduction={régularisation}
				répartition={répartition}
				displayedUnit={displayedUnit}
				language={language}
				alignment="center"
				withRépartition={withRépartition}
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
		</div>
	) : (
		<tr>
			<th scope="row">{label}</th>
			<td>
				<MontantRéduction />
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
