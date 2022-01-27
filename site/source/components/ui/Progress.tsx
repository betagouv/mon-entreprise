import { useProgressBar } from '@react-aria/progress'
import styled from 'styled-components'

type ProgressProps = {
	progress: number
}

export default function Progress({ progress }: ProgressProps) {
	const propsBar = {
		showValueLabel: false,
		label: 'Précision de votre simulation',
		minValue: 0,
		maxValue: 1,
		value: progress,
	}

	const { progressBarProps, labelProps } = useProgressBar(propsBar)

	return (
		<>
			<span {...labelProps} className="sr-only">
				{propsBar.label}
			</span>
			<ProgressContainer {...progressBarProps}>
				<ProgressBar style={{ width: `${progress * 100}%` }} />
			</ProgressContainer>
		</>
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
