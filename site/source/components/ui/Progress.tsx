import { useProgressBar } from '@react-aria/progress'
import styled from 'styled-components'

import { Body } from '@/design-system/typography/paragraphs'

type ProgressProps = {
	progress: number
	minValue?: number
	maxValue?: number
	step?: number
}

export default function Progress({
	progress,
	minValue = 0,
	maxValue = 1,
	step = 1,
}: ProgressProps) {
	const propsBar = {
		showValueLabel: false,
		label: 'Questions répondues pour améliorer la précision de la simulation',
		minValue,
		maxValue,
		value: progress,
	}

	const a11yPrefixLabel = `Étape ${Math.min(
		progress + step,
		maxValue
	)} sur ${String(maxValue)}`

	const { progressBarProps, labelProps } = useProgressBar(propsBar)

	return (
		<div aria-live="polite">
			<ProgressContainer {...progressBarProps}>
				<ProgressBar
					style={{ width: `${(progress * 100) / (maxValue || 1)}%` }}
				/>
			</ProgressContainer>
			<StyledBody {...labelProps} aria-hidden>
				{a11yPrefixLabel}
			</StyledBody>
		</div>
	)
}

const ProgressContainer = styled.div`
	width: 100%;
	background-color: ${({ theme }) => theme.colors.bases.primary[100]};
`
const ProgressBar = styled.div`
	width: 0;
	transition: width 0.5s;
	background-color: ${({ theme }) => theme.colors.bases.primary[500]};
	height: ${({ theme }) => theme.spacings.xxs};
`
const StyledBody = styled(Body)`
	position: absolute;
	top: 0;
	right: 0;
	font-size: 0.825rem;
	padding: 0.25rem 1.5rem;
	margin: 0;
	color: ${({ theme }) => theme.colors.extended.grey[600]}!important;
`
