import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { DocumentationHelpButton } from '@/components/documentation/DocumentationHelpButton'
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
			<StyledFieldset>
				<StyledLegend>
					{Question.libellé(t)}
					{Question.documentation && (
						<DocumentationHelpButton
							sujet={Question.libellé(t)}
							documentation={Question.documentation}
						/>
					)}
				</StyledLegend>

				<Question />
			</StyledFieldset>
		)
	}

	const labelId = `${Question.id}-label`

	return (
		<>
			<LabelWithMargin as="label" id={labelId} htmlFor={Question.id}>
				{Question.libellé(t)}
				{Question.documentation && (
					<DocumentationHelpButton
						sujet={Question.libellé(t)}
						documentation={Question.documentation}
					/>
				)}
			</LabelWithMargin>

			<Question labelId={labelId} />
		</>
	)
}

// Style nécessaire pour un affichage des marges et paddings uniformes dans les
// différents navigateurs
const StyledFieldset = styled.fieldset`
	display: contents;

	padding: 0;
	margin: 0;
	border: none;
`

const StyledLegend = styled.legend`
	${H3Style}

	margin: ${({ theme }) => `${theme.spacings.lg} 0 ${theme.spacings.xxs}`};
`

const LabelWithMargin = styled(H3)`
	display: inline-block;

	margin: ${({ theme }) => `${theme.spacings.lg} 0 ${theme.spacings.xs}`};
`
