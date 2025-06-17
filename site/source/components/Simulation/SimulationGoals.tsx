import React from 'react'
import { Trans } from 'react-i18next'
import { useSelector } from 'react-redux'
import { css, styled } from 'styled-components'

import { ForceThemeProvider } from '@/components/utils/DarkModeContext'
import { Body, Grid } from '@/design-system'
import { WatchInitialRender } from '@/hooks/useInitialRender'
import { useIsEmbedded } from '@/hooks/useIsEmbedded'
import { firstStepCompletedSelector } from '@/store/selectors/simulationSelectors'

import { LogoWithLink } from '../Logo'

type SimulationGoalsProps = {
	legend: string

	children: React.ReactNode
	toggles?: React.ReactNode
}

export function SimulationGoals({
	legend,
	toggles,
	children,
}: SimulationGoalsProps) {
	const isFirstStepCompleted = useSelector(firstStepCompletedSelector)
	const isEmbeded = useIsEmbedded()

	return (
		<WatchInitialRender>
			<div role="group" aria-labelledby="simulator-legend-label">
				<TopSection toggles={toggles} />

				<SimulationGoalsContainer
					$isEmbeded={isEmbeded}
					$isFirstStepCompleted={isFirstStepCompleted}
					id="simulator-legend"
					aria-live="polite"
				>
					<ForceThemeProvider forceTheme="dark">
						<div className="sr-only" aria-hidden id="simulator-legend-label">
							{legend}
						</div>
						<Body className="print-hidden" id="simu-update-explaining">
							<em>
								<Trans>
									Les données de simulations se mettront automatiquement à jour
									après la modification d'un champ.{' '}
									<span className="sr-only">
										Un panneau s'ouvrira pour vous permettre d'apporter des
										précisions à la simulation, des résultats détaillés
										s'afficheront en dessous du formulaire et seront mis à jour
										quand vous modifierez ce dernier.
									</span>
								</Trans>
							</em>
						</Body>
						{children}
					</ForceThemeProvider>
				</SimulationGoalsContainer>
			</div>
		</WatchInitialRender>
	)
}

export const SimulationGoalsContainer = styled.div<{
	$isFirstStepCompleted: boolean
	$isEmbeded: boolean
}>`
	z-index: 2;
	position: relative;
	padding: ${({ theme }) => `${theme.spacings.sm} ${theme.spacings.lg}`};
	border-radius: ${({ theme }) => theme.box.borderRadius};
	${({ $isEmbeded }) =>
		!$isEmbeded &&
		css`
			border-top-right-radius: 0;
		`}
	${({ $isFirstStepCompleted }) =>
		$isFirstStepCompleted &&
		css`
			border-bottom-right-radius: 0;
			border-bottom-left-radius: 0;
		`}
	transition: border-radius 0.15s;
	background: ${({ theme }) => theme.colors.bases.primary[600]};

	#simu-update-explaining {
		text-align: center;
	}

	& > div:not(.sr-only) {
		margin-top: 1rem;
	}

	@media print {
		background: initial;
		padding: 0;
	}

	@media (max-width: ${({ theme }) => theme.breakpointsWidth.sm}) {
		border-start-end-radius: ${({ theme }) => theme.box.borderRadius};

		#simu-update-explaining {
			text-align: left;
		}

		& > div:not(.sr-only) {
			margin-top: 0.5rem;
		}
	}
`

function TopSection({ toggles }: { toggles?: React.ReactNode }) {
	const inIframe = useIsEmbedded()

	return (
		<Section container>
			{inIframe && (
				<Grid
					item
					style={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'flex-end',
					}}
				>
					<LogoWithLink />
				</Grid>
			)}
			{toggles && (
				<Grid item xs>
					<ToggleSection
						// Margin right is needed to avoid the feedback button to overlap the toggles in the iframe
						style={inIframe ? { marginRight: '40px' } : {}}
					>
						{toggles}
					</ToggleSection>
				</Grid>
			)}
		</Section>
	)
}

const Section = styled(Grid)`
	justify-content: space-between;
	gap: ${({ theme }) => theme.spacings.xs};
`

export const ToggleSection = styled.div`
	padding: ${({ theme }) => theme.spacings.sm} 0;
	padding-bottom: 0;
	display: flex;
	justify-content: right;
	text-align: right;

	flex-wrap: wrap;
	align-items: flex-start;
	white-space: nowrap;
	gap: ${({ theme }) => theme.spacings.sm};

	> * {
		flex-basis: 100%;
	}
	> *:last-child {
		flex: 1;
	}
	@media (max-width: ${({ theme }) => theme.breakpointsWidth.sm}) {
		white-space: normal;
		justify-content: center;
		text-align: center;

		> * > * {
			justify-content: center;
		}
	}
	@media (min-width: ${({ theme }) => theme.breakpointsWidth.lg}) {
		> * {
			flex-basis: initial;
		}
	}
`
