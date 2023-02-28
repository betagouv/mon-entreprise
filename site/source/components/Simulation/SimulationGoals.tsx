import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import styled, { css } from 'styled-components'

import { ForceThemeProvider } from '@/contexts/DarkModeContext'
import { Grid } from '@/design-system/layout'
import { Link } from '@/design-system/typography/link'
import { SmallBody } from '@/design-system/typography/paragraphs'
import { firstStepCompletedSelector } from '@/selectors/simulationSelectors'

import { Logo } from '../Logo'
import { WatchInitialRender } from '../utils/useInitialRender'
import { useIsEmbedded } from '../utils/useIsEmbedded'

type SimulationGoalsProps = {
	legend: string
	publique?:
		| 'employeur'
		| 'particulier'
		| 'artisteAuteur'
		| 'independant'
		| 'marin'
	children: React.ReactNode
	toggles?: React.ReactNode
}

export function SimulationGoals({
	publique,
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
					isEmbeded={isEmbeded}
					isFirstStepCompleted={isFirstStepCompleted}
					publique={publique}
					id="simulator-legend"
					aria-live="polite"
				>
					<ForceThemeProvider forceTheme="dark">
						<div className="sr-only" aria-hidden id="simulator-legend-label">
							{legend}
						</div>
						<SmallBody className="print-hidden">
							<em>
								<Trans>
									Les données de simulations se mettront automatiquement à jour
									après la modification d'un champ
								</Trans>
							</em>
						</SmallBody>
						{children}
					</ForceThemeProvider>
				</SimulationGoalsContainer>
			</div>
		</WatchInitialRender>
	)
}

export const SimulationGoalsContainer = styled.div<
	Pick<SimulationGoalsProps, 'publique'> & {
		isFirstStepCompleted: boolean
		isEmbeded: boolean
	}
>`
	z-index: 1;
	position: relative;
	padding: ${({ theme }) => `${theme.spacings.sm} ${theme.spacings.lg}`};
	border-start-end-radius: 0;
	border-end-start-radius: 0;
	border-end-end-radius: 0;
	border-start-start-radius: ${({ theme }) => theme.box.borderRadius};
	${({ isFirstStepCompleted }) =>
		isFirstStepCompleted &&
		css`
			border-bottom-right-radius: 0;
			border-bottom-left-radius: 0;
		`}
	transition: border-radius 0.15s;
	background: ${({ theme, publique, isEmbeded }) => {
		const colorPalette =
			publique && !isEmbeded
				? theme.colors.publics[publique]
				: theme.colors.bases.primary

		return css`
			${colorPalette[600]};
		`
	}};

	@media print {
		background: initial;
		padding: 0;
	}
	@media (max-width: ${({ theme }) => theme.breakpointsWidth.sm}) {
		border-start-start-radius: ${({ theme }) => theme.box.borderRadius};
		border-start-end-radius: ${({ theme }) => theme.box.borderRadius};
	}
`

function TopSection({ toggles }: { toggles?: React.ReactNode }) {
	const inIframe = useIsEmbedded()

	const { t } = useTranslation()

	return (
		<Section>
			{inIframe && (
				<Grid
					item
					css={`
						display: flex;
						justify-content: center;
						align-items: flex-end;
					`}
				>
					<LogoContainer
						href={import.meta.env.VITE_FR_BASE_URL}
						target="_blank"
						rel="noreferrer"
						aria-label={t("Accéder à la page d'accueil, nouvelle fenêtre")}
					>
						<Logo />
					</LogoContainer>
				</Grid>
			)}
			{toggles && (
				<Grid item xs>
					<ToggleSection>{toggles}</ToggleSection>
				</Grid>
			)}
		</Section>
	)
}

const Section = styled(Grid).attrs({ container: true })`
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

const LogoContainer = styled(Link)`
	display: block;
	height: 4rem;
	padding: ${({ theme }) => theme.spacings.md} 0;
	text-align: center;
`
