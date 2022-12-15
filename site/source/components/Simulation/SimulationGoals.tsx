import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import styled, { css } from 'styled-components'

import { Grid } from '@/design-system/layout'
import { Link } from '@/design-system/typography/link'
import { firstStepCompletedSelector } from '@/selectors/simulationSelectors'

import { Logo } from '../Logo'
import { WatchInitialRender } from '../utils/useInitialRender'
import { useIsEmbedded } from '../utils/useIsEmbedded'

type SimulationGoalsProps = {
	className?: string
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
			<TopSection toggles={toggles} />

			<StyledSimulationGoals
				isEmbeded={isEmbeded}
				isFirstStepCompleted={isFirstStepCompleted}
				publique={publique}
				role="group"
				id="simulator-legend"
				aria-labelledby="simulator-legend-label"
				aria-live="polite"
			>
				<div className="sr-only" aria-hidden id="simulator-legend-label">
					{legend}
				</div>
				{children}
			</StyledSimulationGoals>
		</WatchInitialRender>
	)
}

const StyledSimulationGoals = styled.div<
	Pick<SimulationGoalsProps, 'publique'> & {
		isFirstStepCompleted: boolean
		isEmbeded: boolean
	}
>`
	z-index: 1;
	position: relative;
	padding: ${({ theme }) => `${theme.spacings.sm} ${theme.spacings.lg}`};
	border-radius: ${({ theme }) => theme.box.borderRadius};
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

		return css`linear-gradient(60deg, ${colorPalette[800]} 0%, ${colorPalette[600]} 100%);`
	}};

	@media print {
		background: initial;
		padding: 0;
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

const ToggleSection = styled.div`
	padding: ${({ theme }) => theme.spacings.sm} 0;

	display: flex;
	justify-content: right;
	text-align: right;

	flex-wrap: wrap-reverse;
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
