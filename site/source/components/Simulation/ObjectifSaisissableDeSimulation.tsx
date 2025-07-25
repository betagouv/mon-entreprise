import { Option } from 'effect'
import React from 'react'
import { styled } from 'styled-components'

import { ForceThemeProvider } from '@/components/utils/DarkModeContext'
import { Grid, SmallBody, TitreObjectifSaisissable } from '@/design-system'
import { Montant } from '@/domaine/Montant'
import { useInitialRender } from '@/hooks/useInitialRender'

import LectureGuide from '../LectureGuide'
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
}: ObjectifSaisissableDeSimulationProps) {
	const initialRender = useInitialRender()

	const montantAnimation = Option.isSome(valeur) ? valeur.value : undefined

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
					<LectureGuide />
					<Grid item md={small ? 2 : 3} sm={small ? 3 : 4} xs={4}>
						{!small && montantAnimation !== undefined && (
							<AnimatedTargetValue value={montantAnimation} />
						)}
						{rendreChampSaisie()}
					</Grid>
				</Grid>
			</StyledGoal>
		</Appear>
	)
}

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
