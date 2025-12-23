import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { Body } from '@/design-system'

type ProgressProps = {
	progress: number
	maxValue?: number
}

export default function Progress({ progress, maxValue = 1 }: ProgressProps) {
	const { t } = useTranslation()

	const total = Math.min(progress, maxValue).toString()

	return (
		<div style={{ position: 'relative' }}>
			<ProgressBar style={{ width: `${(progress * 100) / maxValue}%` }} />

			<StyledBody role="alert">
				{t('Étape {{ total }} sur {{ maxValue }}', { total, maxValue })}
			</StyledBody>
		</div>
	)
}

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
