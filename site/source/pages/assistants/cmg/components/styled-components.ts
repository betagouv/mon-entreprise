import { styled } from 'styled-components'

import { Body, ExtraSmallBody, H2, H3, Intro, SmallBody } from '@/design-system'

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

export const Titre2 = styled(H2)`
	&::after {
		display: none;
	}
`
export const Titre3 = styled(H3)`
	margin: 0;
`
