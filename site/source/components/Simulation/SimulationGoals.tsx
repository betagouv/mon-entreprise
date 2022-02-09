import { Grid } from '@mui/material'
import { Link } from 'DesignSystem/typography/link'
import React from 'react'
import { useSelector } from 'react-redux'
import { firstStepCompletedSelector } from 'Selectors/simulationSelectors'
import styled, { css, ThemeProvider } from 'styled-components'
import { Logo } from '../Logo'
import { useIsEmbedded } from '../utils/embeddedContext'
import { WatchInitialRender } from '../utils/useInitialRender'

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

	return (
		<WatchInitialRender>
			<TopSection toggles={toggles} />

			<StyledSimulationGoals
				isFirstStepCompleted={isFirstStepCompleted}
				publique={publique}
				role="group"
				aria-labelledby="simulator-legend"
			>
				<ThemeProvider theme={(theme) => ({ ...theme, darkMode: true })}>
					<div className="sr-only" id="simulator-legend">
						{legend}
					</div>
					{children}
				</ThemeProvider>
			</StyledSimulationGoals>
		</WatchInitialRender>
	)
}

const StyledSimulationGoals = styled.div<
	Pick<SimulationGoalsProps, 'publique'> & { isFirstStepCompleted: boolean }
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
	background: ${({ theme, publique }) => {
		const colorPalette = publique
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

	return (
		<Grid container justifyContent="space-between" gap={1}>
			{inIframe && (
				<Grid
					item
					xs={12}
					sm="auto"
					container
					alignItems="flex-end"
					justifyContent="center"
				>
					<LogoContainer
						href={import.meta.env.VITE_FR_BASE_URL}
						target="_blank"
						rel="noreferrer"
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
		</Grid>
	)
}

const ToggleSection = styled.div`
	padding: ${({ theme }) => theme.spacings.sm} 0;

	display: flex;
	justify-content: right;
	text-align: right;

	flex-wrap: wrap-reverse;
	align-items: flex-start;
	white-space: nowrap;
	gap: ${({ theme }) => theme.spacings.sm};

	> *:last-child {
		flex: 1;
	}
	@media (max-width: ${({ theme }) => theme.breakpointsWidth.sm}) {
		white-space: normal;
		justify-content: center;
		text-align: center;
	}
`

const LogoContainer = styled(Link)`
	height: 4rem;
	padding: ${({ theme }) => theme.spacings.md} 0;
	text-align: center;
`
