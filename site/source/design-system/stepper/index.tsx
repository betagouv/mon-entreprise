import { useProgressBar } from '@react-aria/progress'
import { useSSRSafeId } from '@react-aria/ssr'
import { AriaButtonProps } from '@react-types/button'
import { ComponentPropsWithRef } from 'react'
import { Trans } from 'react-i18next'
import { css, styled } from 'styled-components'

import { Link as RouterLink, useMatchPath } from '@/lib/navigation'

import { Link } from '../typography/link'

type Props = {
	isDisabled?: boolean
	progress: number
	to: string
} & AriaButtonProps<typeof RouterLink> &
	ComponentPropsWithRef<typeof RouterLink>

export function Step({
	isDisabled = false,
	progress,
	children,
	...props
}: Props) {
	const labelId = useSSRSafeId()
	if (import.meta.env.DEV && (progress > 1 || progress < 0)) {
		throw new TypeError('`progress` should be a number between 0 and 1')
	}
	const active = useMatchPath(props.to)
	const propsBar = {
		'aria-labelledby': labelId,
		minValue: 0,
		maxValue: 100,
		value: progress * 100,
	}
	const { progressBarProps } = useProgressBar(propsBar)

	return (
		<StyledStepContainer {...(active && { 'aria-current': 'step' })}>
			<StyledStep
				$active={active}
				isDisabled={isDisabled}
				{...(!isDisabled ? props : {})}
			>
				<span style={{ display: 'block' }} id={labelId}>
					<StyledStepNumber $active={active} $disabled={isDisabled} />
					{children}
				</span>
				<span style={{ display: 'block' }} className="sr-only">
					{progress > 0 ? (
						<Trans>Étape non complétée</Trans>
					) : (
						progress === 1 && <Trans>Étape complétée</Trans>
					)}
				</span>
				<StyledProgressBar
					$active={active}
					$progress={progress}
					$isDisabled={isDisabled}
					{...progressBarProps}
				></StyledProgressBar>
			</StyledStep>
		</StyledStepContainer>
	)
}

export function Stepper({
	children,
	...props
}: { children: Array<React.ReactElement<Props, typeof Step>> } & (
	| { 'aria-label': string }
	| { 'aria-labelledby': string }
)) {
	return (
		<div {...props}>
			<StyledStepper>{children}</StyledStepper>
		</div>
	)
}

const StyledStepper = styled.ol`
	margin: 0;
	padding: 0;
	list-style-type: none;
`
const StyledStepContainer = styled.li`
	counter-increment: step-counter;
	display: inline-block;
	margin-right: ${({ theme }) => theme.spacings.lg};
	&:last-child {
		margin-right: 0;
	}
	margin-bottom: ${({ theme }) => theme.spacings.md};
	* {
		transition:
			background-color 0.1s,
			color 0.1s,
			border-color 0.1s;
	}
`
const StyledStepNumber = styled.span<{ $active: boolean; $disabled: boolean }>`
	&::before {
		content: counter(step-counter);
		font-size: 1.125rem;
		font-weight: 500;
	}
	display: inline-flex;
	align-items: center;
	justify-content: center;
	border-radius: 100%;
	height: ${({ theme }) => theme.spacings.xl};
	width: ${({ theme }) => theme.spacings.xl};
	color: ${({ theme, $disabled }) =>
		theme.colors.extended.grey[$disabled ? 600 : 100]};
	border: 2px solid
		${({ theme, $active, $disabled }) =>
			$disabled
				? theme.colors.extended.grey[600]
				: theme.colors.bases.primary[$active ? 800 : 600]};
	background-color: ${({ theme, $active, $disabled }) =>
		$disabled
			? 'transparent'
			: theme.colors.bases.primary[$active ? 800 : 600]};

	margin-right: ${({ theme }) => theme.spacings.xs};
`

const StyledStep = styled(Link)<{ $active: boolean }>`
	text-decoration: none;
	text-align: left;
	display: inline-block;
	${({ $active, theme }) =>
		$active
			? css`
					color: ${theme.colors.bases.primary[800]};
					background-color: inherit;
			  `
			: css`
					font-weight: inherit;
			  `};
`
const StyledProgressBar = styled.span<{
	$active: boolean
	$progress: number
	$isDisabled: boolean
}>`
	display: block;
	width: 10.115rem;
	height: 0.375rem;
	margin-top: ${({ theme }) => theme.spacings.md};
	border-radius: ${({ theme }) => theme.box.borderRadius};
	background-color: ${({ theme }) => theme.colors.extended.grey[300]};

	position: relative;
	&::after {
		display: block;
		content: '';
		height: inherit;
		border-radius: inherit;
		width: ${({ $progress }) => $progress * 100}%;
		min-width: ${({ theme, $active }) => $active && theme.spacings.xs};
		background-color: ${({ theme, $active, $isDisabled }) =>
			$isDisabled
				? theme.colors.extended.grey[600]
				: theme.colors.bases.primary[$active ? 800 : 600]};
		z-index: 1;
		position: absolute;
		transition: width 0.2s;
	}
`
