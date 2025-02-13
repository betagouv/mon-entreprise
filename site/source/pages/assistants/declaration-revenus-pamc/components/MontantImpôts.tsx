import { EvaluatedNode, formatValue } from 'publicodes'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { Body } from '@/design-system/typography/paragraphs'

type Props = {
	evaluation: EvaluatedNode
	idPrefix: string
}

export default function MontantImpôts({ evaluation, idPrefix }: Props) {
	const language = useTranslation().i18n.language

	return (
		<Value id={`${idPrefix}-value`}>
			{formatValue(evaluation, {
				language,
				displayedUnit: '',
			})}
		</Value>
	)
}

const Value = styled(Body)`
	margin: ${({ theme }) => `${theme.spacings.xs} ${theme.spacings.sm} 0 0`};
	width: 100px;
	min-height: ${({ theme }) => theme.spacings.xl};
	padding: ${({ theme }) => `${theme.spacings.xxs} ${theme.spacings.xs}`};
	background-color: ${({ theme }) => theme.colors.extended.grey[100]};
	border-radius: ${({ theme }) => theme.spacings.xxs};
	color: ${({ theme }) => theme.colors.extended.dark[800]} !important;
`
