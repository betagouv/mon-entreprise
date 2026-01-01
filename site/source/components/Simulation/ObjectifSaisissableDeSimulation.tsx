import * as O from 'effect/Option'
import React, { useState } from 'react'
import { styled } from 'styled-components'

import { ForceThemeProvider } from '@/components/utils/DarkModeContext'
import { Body, Grid, TitreObjectifSaisissable } from '@/design-system'
import { Montant } from '@/domaine/Montant'
import { useInitialRender } from '@/hooks/useInitialRender'

import { Appear } from '../ui/animate'
import AnimatedTargetValue from '../ui/AnimatedTargetValue'

export interface ChampSaisieProps {
	id: string
	aria: { labelledby: string }
	valeur: O.Option<Montant>
	onChange: (valeur: O.Option<Montant>) => void
}

export type ObjectifSaisissableDeSimulationProps = {
	id: string
	titre: React.ReactNode
	description?: React.ReactNode
	explication?: React.ReactNode
	valeur: O.Option<Montant>
	onChange: (valeur: O.Option<Montant>) => void
	ChampSaisie: React.ComponentType<ChampSaisieProps>
	small?: boolean
	appear?: boolean
	isInfoMode?: boolean
	onFocus?: () => void
	onBlur?: () => void
}

export function ObjectifSaisissableDeSimulation({
	id,
	titre,
	description,
	explication,
	valeur,
	onChange,
	ChampSaisie,
	small = false,
	appear = true,
	onFocus,
	onBlur,
}: ObjectifSaisissableDeSimulationProps) {
	const initialRender = useInitialRender()
	const [isFocused, setFocused] = useState(false)

	const handleFocus = () => {
		setFocused(true)
		onFocus?.()
	}

	const handleBlur = () => {
		setFocused(false)
		onBlur?.()
	}

	const montantAnimation = O.isSome(valeur) ? valeur.value : undefined

	return (
		<Appear unless={!appear || initialRender}>
			<StyledGoal $small={small}>
				<GridCentered container spacing={2}>
					<Grid item>
						<TitreObjectifSaisissable
							id={`${id}-label`}
							htmlFor={`${id}-input`}
							noWrap={false}
						>
							{titre}
						</TitreObjectifSaisissable>

						{explication && (
							<BiggerForceThemeProvider forceTheme="default">
								{explication}
							</BiggerForceThemeProvider>
						)}

						{description && (
							<StyledBody
								className={small ? 'sr-only' : ''}
								id={`${id}-description`}
							>
								{description}
							</StyledBody>
						)}
					</Grid>

					<Grid item>
						{!isFocused && !small && montantAnimation !== undefined && (
							<AnimatedTargetValue value={montantAnimation} />
						)}
						<LargeInputContainer onFocus={handleFocus} onBlur={handleBlur}>
							<ChampSaisie
								id={`${id}-input`}
								aria={{ labelledby: `${id}-label` }}
								valeur={valeur}
								onChange={onChange}
							/>
						</LargeInputContainer>
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
		text-align: right;

		&:first-child {
			p {
				margin-top: 0;
			}
		}

		&:nth-child(2) {
			& [role*='presentation'] > div > div {
				display: flex;
				flex-direction: column;
				gap: ${({ theme }) => theme.spacings.xs};

				p {
					margin-bottom: 0;
				}

				span:empty {
					display: none;
				}
			}
		}
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
	padding: ${({ theme, $small }) => theme.spacings[$small ? 'xxs' : 'xs']} 0;
	z-index: 1;

	@media print {
		padding: 0;
	}
`

const StyledBody = styled(Body)`
	margin-bottom: 0;
`

const BiggerForceThemeProvider = styled(ForceThemeProvider)`
	font-size: 1rem;
`

const LargeInputContainer = styled.div`
	input {
		font-size: ${({ theme }) => theme.fontSizes.lg};
		line-height: 1.5;
	}

	span:empty {
		display: none;
	}
`
