import { Grid } from '@/design-system/layout'
import { Link } from '@/design-system/typography/link'
import { firstStepCompletedSelector } from '@/selectors/simulationSelectors'
import React from 'react'
import { useSelector } from 'react-redux'
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
				<ThemeProvider theme={(theme) => ({ ...theme, darkMode: true })}>
					<div
						className="sr-only"
						aria-hidden="true"
						id="simulator-legendlabel"
					>
						{legend}
					</div>
					{children}
				</ThemeProvider>
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
