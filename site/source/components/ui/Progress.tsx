import { useProgressBar } from '@react-aria/progress'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { Body } from '@/design-system'

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
}: ProgressProps) {
	const { t } = useTranslation()
	const propsBar = {
		showValueLabel: false,
		label: 'Questions répondues pour améliorer la précision de la simulation',
		minValue,
		maxValue,
		value: progress,
	}

	const { progressBarProps, labelProps } = useProgressBar(propsBar)
	const total = Math.min(progress, maxValue).toString()

	return (
		<div style={{ position: 'relative' }}>
			<ProgressContainer {...progressBarProps}>
				<ProgressBar
					style={{ width: `${(progress * 100) / (maxValue || 1)}%` }}
				/>
			</ProgressContainer>

			<StyledBody {...labelProps} role="alert">
				{t('Étape {{ total }} sur {{ maxValue }}', { total, maxValue })}
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
	color: ${({ theme }) =>
		theme.darkMode
			? theme.colors.extended.grey[200]
			: theme.colors.extended.grey[600]}!important;
`
