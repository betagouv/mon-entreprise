import { useProgressBar } from '@react-aria/progress'
import styled from 'styled-components'

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
		label: 'Précisions concernant votre simulation',
		minValue,
		maxValue,
		value: progress,
	}

	const a11yPrefixLabel = `Étape ${progress + step} sur ${String(maxValue)}, `

	const { progressBarProps, labelProps } = useProgressBar(propsBar)

	return (
		<div aria-live="polite">
			<span {...labelProps} className="sr-only" aria-hidden>
				{`${a11yPrefixLabel} ${propsBar.label}`}
			</span>
			<ProgressContainer {...progressBarProps}>
				<ProgressBar
					style={{ width: `${(progress * 100) / (maxValue || 1)}%` }}
				/>
			</ProgressContainer>
		</div>
	)
}

const ProgressContainer = styled.div`
	width: 100%;
	background-color: ${({ theme }) => theme.colors.bases.primary[100]};
`
const ProgressBar = styled.div`
	width: 0;
	transition: width 0.15s;
	background-color: ${({ theme }) => theme.colors.bases.primary[500]};
	height: ${({ theme }) => theme.spacings.xxs};
`
