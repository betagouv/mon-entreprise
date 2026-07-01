import { css, styled } from 'styled-components'

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
		margin-top: ${({ theme }) => theme.spacings.md};
	}
	& > :is(div, fieldset) {
		max-width: 75%;
		margin-inline: auto;
		@media (max-width: ${({ theme }) => theme.breakpointsWidth.sm}) {
			max-width: 100%;
		}
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
			margin-top: ${({ theme }) => theme.spacings.xs};
		}
	}
`
