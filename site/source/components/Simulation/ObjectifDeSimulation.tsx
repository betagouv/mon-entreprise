import { Option } from 'effect'
import React from 'react'
import { styled } from 'styled-components'

import { ForceThemeProvider } from '@/components/utils/DarkModeContext'
import { Grid, TitreObjectif, typography } from '@/design-system'
import { toString as formatMontant, Montant } from '@/domaine/Montant'
import { useInitialRender } from '@/hooks/useInitialRender'

import LectureGuide from '../LectureGuide'
import { Appear } from '../ui/animate'
import AnimatedTargetValue from '../ui/AnimatedTargetValue'

const { Body, SmallBody } = typography

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
				<Grid
					container
					style={{
						alignItems: 'baseline',
						justifyContent: 'space-between',
					}}
					spacing={2}
				>
					<Grid item md="auto" sm={small ? 9 : 8} xs={8}>
						<TitreObjectif id={`${id}-label`} noWrap={true}>
							{titre}
						</TitreObjectif>

						{explication && (
							<ForceThemeProvider forceTheme="default">
								{explication}
							</ForceThemeProvider>
						)}

						{description && (
							<StyledSmallBody
								className={small ? 'sr-only' : ''}
								id={`${id}-description`}
							>
								{description}
							</StyledSmallBody>
						)}

						{messageComplementaire && (
							<StyledSmallBody>{messageComplementaire}</StyledSmallBody>
						)}
					</Grid>
					<LectureGuide />
					<Grid item>
						{!small && typeof valeur !== 'string' && Option.isSome(valeur) && (
							<AnimatedTargetValue value={valeur.value} />
						)}
						<StyledValue id={`${id}-value`}>{valeurAffichee}</StyledValue>
					</Grid>
				</Grid>
			</StyledGoal>
		</Appear>
	)
}

const StyledGoal = styled.div<{ $small: boolean }>`
	position: relative;
	z-index: 1;
	padding: ${({ theme, $small }) => theme.spacings[$small ? 'xxs' : 'sm']} 0;

	@media print {
		padding: 0;
	}
`

const StyledSmallBody = styled(SmallBody)`
	margin-bottom: 0;
	font-size: 1rem;
`

const StyledValue = styled(Body)`
	margin: 1.2rem 0;
`
