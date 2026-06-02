import { useTranslation } from 'react-i18next'
import { css, styled } from 'styled-components'

import { Body, Button, EditIcon } from '@/design-system'
import { DottedName } from '@/domaine/publicodes/DottedName'
import { Situation } from '@/domaine/Situation'
import { Question } from '@/hooks/useQuestionsV2'

import { ExplicableRule } from '../conversation/Explicable'
import Value from '../EngineValue/Value'

export type QuestionEnListe = {
	id: DottedName
	label: string
	répondue: boolean
}

type Props<S extends Situation = Situation> = {
	questions: Question<S>[]
	situation?: S
	onSélection: (question: Question<S>) => void
}

export const ListeQuestions = ({
	questions,
	situation,
	onSélection,
}: Props) => {
	const { t } = useTranslation()

	return questions.map((question) => (
		<QuestionContainer key={question.id}>
			<LabelContainer>
				{question.libellé(t)}
				<ExplicableRule
					aria-label={t(`Info sur {{ title }}`, {
						title: question.libellé(t),
					})}
					light
					dottedName={question.id}
				/>
			</LabelContainer>

			<ValueContainer>
				<StyledValue
					expression={question.id}
					linkToRule={false}
					$répondue={question.répondue(situation)}
				/>
				<EditButton light onPress={() => onSélection(question)}>
					<EditIcon />
				</EditButton>
			</ValueContainer>
		</QuestionContainer>
	))
}

const QuestionContainer = styled.div`
	display: flex;
	justify-content: space-between;
	gap: 0 ${({ theme }) => theme.spacings.sm};
	padding: ${({ theme }) => theme.spacings.sm} 0;
	&:not(:last-of-type) {
		border-bottom: solid 1px ${({ theme }) => theme.colors.extended.grey[300]};
	}
`

const LabelContainer = styled(Body)`
	margin: 0;
`

const ValueContainer = styled(Body)`
	margin: 0;
	white-space: nowrap;
	display: flex;
	align-items: center;
	gap: 0 ${({ theme }) => theme.spacings.xxs};
`

const StyledValue = styled(Value)<{ $répondue: boolean }>`
	${({ $répondue }) =>
		$répondue &&
		css`
			font-weight: 700;
		`}
`

// TODO: vérifier les couleurs une fois #4464 mergée
const EditButton = styled(Button)`
	border: none;
	svg {
		fill: ${({ theme }) => theme.colors.bases.primary[700]};
	}
	display: flex;
	align-items: center;
	gap: ${({ theme }) => theme.spacings.xs};
	font-weight: 700;
	padding: ${({ theme }) => theme.spacings.xxs};
	border-radius: ${({ theme }) => theme.box.borderRadius};
`
