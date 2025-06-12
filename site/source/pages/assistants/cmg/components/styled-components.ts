import { styled } from 'styled-components'

import { Body, ExtraSmallBody, Intro, SmallBody } from '@/design-system'

export const Question = styled(Intro)`
	margin-bottom: 0;
	font-weight: bold;
	color: ${({ theme }) => theme.colors.bases.primary['700']};
`

export const DescriptionQuestion = styled(SmallBody)`
	margin-top: 0;
	color: ${({ theme }) => theme.colors.bases.primary['700']};
`

export const Label = styled(Body)`
	margin-top: 0;
	margin-bottom: ${({ theme }) => theme.spacings.xxs};
	font-weight: bold;
`

export const MessageFormulaireInvalide = styled(ExtraSmallBody)`
	text-align: right;
`
