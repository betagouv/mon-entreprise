import { Option } from 'effect'
import React from 'react'
import { styled } from 'styled-components'

import { ForceThemeProvider } from '@/components/utils/DarkModeContext'
import { Grid } from '@/design-system/layout'
import { Body, SmallBody } from '@/design-system/typography/paragraphs'
import { TitreObjectif } from '@/design-system/typography/TitreObjectif'
import { Montant, toString as formatMontant } from '@/domaine/Montant'
import { useInitialRender } from '@/hooks/useInitialRender'

import LectureGuide from '../LectureGuide'
import { Appear } from '../ui/animate'
import AnimatedTargetValue from '../ui/AnimatedTargetValue'

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
}

export function ObjectifDeSimulation({
	id,
	titre,
	description,
	explication,
	valeur,
	messageComplementaire,
	small = false,
	appear = true,
	isInfoMode = false,
}: ObjectifDeSimulationProps) {
	const initialRender = useInitialRender()
	
	const valeurAffichee = typeof valeur === 'string' 
		? valeur 
		: Option.match(valeur, {
			onNone: () => '—',
			onSome: (montant) => formatMontant(montant)
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
						<div>
							<Grid
								container
								style={{
									alignItems: 'center',
								}}
							>
								<Grid item>
									<TitreObjectif
										id={`${id}-label`}
										isInfoMode={isInfoMode}
										noWrap={true}
									>
										{titre}
									</TitreObjectif>
								</Grid>
								{explication && (
									<Grid item>
										<ForceThemeProvider forceTheme="default">
											{explication}
										</ForceThemeProvider>
									</Grid>
								)}
							</Grid>

							{description && (
								<StyledSmallBody
									className={small ? 'sr-only' : ''}
									id={`${id}-description`}
								>
									{description}
								</StyledSmallBody>
							)}
							
							{messageComplementaire && (
								<StyledSmallBody>
									{messageComplementaire}
								</StyledSmallBody>
							)}
						</div>
					</Grid>
					<LectureGuide />
					<Grid item>
						{!small && typeof valeur !== 'string' && Option.isSome(valeur) && (
							<AnimatedTargetValue value={valeur.value} />
						)}
						<Body id={`${id}-value`}>{valeurAffichee}</Body>
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
`