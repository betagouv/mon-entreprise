import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { H3, H3Style } from '@/design-system'
import { Situation } from '@/domaine/Situation'

import { ComposantQuestionFournie } from './ComposantQuestionFournie'

type Props<S extends Situation> = {
	Question: ComposantQuestionFournie<S>
}

export const QuestionFournie = <S extends Situation>({
	Question,
}: Props<S>) => {
	const { t } = useTranslation()

	if (Question.typeRadioGroup) {
		return (
			<fieldset>
				<StyledLegend>{Question.libellé(t)}</StyledLegend>

				<Question />
			</fieldset>
		)
	}

	return (
		<>
			<LabelWithMargin as="label" htmlFor={Question.id}>
				{Question.libellé(t)}
			</LabelWithMargin>

			<Question />
		</>
	)
}

const StyledLegend = styled.legend`
	${H3Style}

	margin: ${({ theme }) => `${theme.spacings.lg} 0 ${theme.spacings.xxs}`};
`

const LabelWithMargin = styled(H3)`
	display: inline-block;

	margin: ${({ theme }) => `${theme.spacings.lg} 0 ${theme.spacings.xs}`};
`
