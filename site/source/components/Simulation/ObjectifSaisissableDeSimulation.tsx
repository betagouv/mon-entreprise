import { Option } from 'effect'
import React, { useState } from 'react'
import { styled } from 'styled-components'

import { ForceThemeProvider } from '@/components/utils/DarkModeContext'
import { Grid, SmallBody, TitreObjectifSaisissable } from '@/design-system'
import { Montant } from '@/domaine/Montant'
import { useInitialRender } from '@/hooks/useInitialRender'

import { Appear } from '../ui/animate'
import AnimatedTargetValue from '../ui/AnimatedTargetValue'

export type ObjectifSaisissableDeSimulationProps = {
	id: string
	titre: React.ReactNode
	description?: React.ReactNode
	explication?: React.ReactNode
	valeur: Option.Option<Montant>
	rendreChampSaisie: () => React.ReactNode
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
	rendreChampSaisie,
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

	const montantAnimation = Option.isSome(valeur) ? valeur.value : undefined

	return (
		<Appear unless={!appear || initialRender}>
			<StyledGoal $small={small}>
				<GridCentered container spacing={2}>
					<Grid item>
						<TitreObjectifSaisissable
							id={`${id}-label`}
							htmlFor={`${id}-input`}
							noWrap={true}
						>
							{titre}
						</TitreObjectifSaisissable>

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
					</Grid>
					<Grid item>
						{!isFocused && !small && montantAnimation !== undefined && (
							<AnimatedTargetValue value={montantAnimation} />
						)}
						<div onFocus={handleFocus} onBlur={handleBlur} role="presentation">
							{rendreChampSaisie()}
						</div>
					</Grid>
				</GridCentered>
			</StyledGoal>
		</Appear>
	)
}

const GridCentered = styled(Grid)`
	display: grid;
	grid-template-columns: 1.5fr 1fr;
	gap: 1rem;
	max-width: 50%;
	margin: 0 auto;

	& > div {
		padding: 0;
		text-align: right;

		&:nth-child(2) {
			& [role*='presentation'] > div > div {
				display: flex;
				flex-direction: column;
				gap: 0.5rem;

				p {
					margin-bottom: 0;
				}

				span:empty {
					display: none;
				}
			}
		}
	}

	p {
		margin-top: 0;
	}

	@media (max-width: ${({ theme }) => theme.breakpointsWidth.lg}) {
		max-width: 75%;
	}

	@media (max-width: ${({ theme }) => theme.breakpointsWidth.md}) {
		max-width: 75%;
	}

	@media (max-width: ${({ theme }) => theme.breakpointsWidth.sm}) {
		grid-template-columns: 1fr;
		max-width: 100%;

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

const StyledSmallBody = styled(SmallBody)`
	margin-bottom: 0;
`
