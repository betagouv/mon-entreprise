import { useTranslation } from 'react-i18next'
import { css, styled } from 'styled-components'

import { DocumentationHelpButton } from '@/components/documentation'
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

	const libellé = Question.libellé(t)

	if (Question.typeRadioGroup) {
		return (
			<StyledFieldset>
				<StyledLegend>
					{libellé}
					{Question.documentation && (
						<DocumentationHelpButton
							sujet={libellé}
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
			<LibelléEtAide>
				<StyledLabel as="label" id={labelId} htmlFor={Question.id}>
					{libellé}
				</StyledLabel>
				{Question.documentation && (
					<DocumentationHelpButton
						sujet={libellé}
						documentation={Question.documentation}
					/>
				)}
			</LibelléEtAide>

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

const LibelléStyle = css`
	display: flex;
	align-items: center;
	margin-top: ${({ theme }) => theme.spacings.lg};
`
const StyledLegend = styled.legend`
	${H3Style}
	${LibelléStyle}
	margin-bottom: ${({ theme }) => theme.spacings.xxs};
`
const LibelléEtAide = styled.div`
	${LibelléStyle}
	margin-bottom: ${({ theme }) => theme.spacings.xs};
`

const StyledLabel = styled(H3)`
	display: inline-block;
	margin: 0;
`
