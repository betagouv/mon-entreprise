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

	const a11yPrefixLabel = `Étape ${progress + step} sur ${String(maxValue)}`

	const { progressBarProps, labelProps } = useProgressBar(propsBar)

	return (
		<div aria-live="polite">
			<ProgressContainer {...progressBarProps}>
				<ProgressBar
					style={{ width: `${(progress * 100) / (maxValue || 1)}%` }}
				/>
			</ProgressContainer>
			<StyledBody {...labelProps} aria-hidden>
				{a11yPrefixLabel} <span className="sr-only">{propsBar.label}</span>
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
	font-size: 0.825rem;
	padding: 0 1.5rem;
	margin-bottom: 0;
	color: ${({ theme }) => theme.colors.extended.grey[600]}!important;
`
