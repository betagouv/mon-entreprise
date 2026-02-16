import { Option } from 'effect'
import React from 'react'
import { styled } from 'styled-components'

import { ForceThemeProvider } from '@/components/utils/DarkModeContext'
import { Grid, TitreObjectif, typography } from '@/design-system'
import { toString as formatMontant, Montant } from '@/domaine/Montant'
import { useInitialRender } from '@/hooks/useInitialRender'

import { Appear } from '../ui/animate'
import AnimatedTargetValue from '../ui/AnimatedTargetValue'

const { Body } = typography

export type ObjectifDeSimulationProps = {
	id: string
	titre: React.ReactNode
	description?: React.ReactNode
	explication?: React.ReactNode
	valeur: Option.Option<Montant> | string
	messageComplementaire?: string
	small?: boolean
	appear?: boolean
	isInfoMode?: boolean
	displayedUnit?: string
}

export function ObjectifDeSimulation({
	id,
	titre,
	description,
	explication,
	valeur,
	messageComplementaire,
	displayedUnit,
	small = false,
	appear = true,
}: ObjectifDeSimulationProps) {
	const initialRender = useInitialRender()

	const valeurAffichee =
		typeof valeur === 'string'
			? valeur
			: Option.match(valeur, {
					onNone: () => '—',
					onSome: (montant) => formatMontant(montant, displayedUnit),
			  })

	return (
		<Appear unless={!appear || initialRender}>
			<StyledGoal $small={small}>
				<GridCentered
					container
					style={{
						alignItems: 'baseline',
						justifyContent: 'space-between',
					}}
					spacing={2}
				>
					<Grid item md="auto" sm={small ? 9 : 8} xs={8}>
						<TitreObjectif id={`${id}-label`}>{titre}</TitreObjectif>
						{explication && (
							<ForceThemeProvider forceTheme="default">
								{explication}
							</ForceThemeProvider>
						)}

						{description && (
							<StyledBody
								className={small ? 'sr-only' : ''}
								id={`${id}-description`}
							>
								{description}
							</StyledBody>
						)}

						{messageComplementaire && (
							<StyledBody>{messageComplementaire}</StyledBody>
						)}
					</Grid>
					<Grid item>
						{!small && typeof valeur !== 'string' && Option.isSome(valeur) && (
							<AnimatedTargetValue value={valeur.value} />
						)}
						<StyledValue id={`${id}-value`}>{valeurAffichee}</StyledValue>
					</Grid>
				</GridCentered>
			</StyledGoal>
		</Appear>
	)
}

const GridCentered = styled(Grid)`
	display: grid;
	grid-template-columns: 1.25fr 1fr;
	gap: ${({ theme }) => theme.spacings.md};

	& > div {
		padding: 0;
		max-width: 100%;
		text-align: right;
	}

	@media (max-width: ${({ theme }) => theme.breakpointsWidth.sm}) {
		grid-template-columns: 1fr;
		gap: ${({ theme }) => theme.spacings.xs};

		& > div {
			text-align: left;
		}
	}
`

const StyledGoal = styled.div<{ $small: boolean }>`
	position: relative;
	z-index: 1;
	padding: ${({ theme, $small }) => theme.spacings[$small ? 'xxs' : 'sm']} 0;

	@media print {
		padding: 0;
	}
`

const StyledBody = styled(Body)`
	margin-bottom: 0;
`

const StyledValue = styled(Body)`
	margin: 1.2rem 0;
	font-size: ${({ theme }) => theme.fontSizes.lg};
	text-align: right;
	padding-right: ${({ theme }) => theme.spacings.sm};
`
