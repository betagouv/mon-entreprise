import React from 'react'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { Button, H3, ReturnLeftIcon } from '@/design-system'
import { Situation } from '@/domaine/Situation'
import { Question } from '@/hooks/useQuestionsEditorialisees'

import { QuestionPublicodes } from './QuestionPublicodes'

type Props<S extends Situation = Situation> = {
	questions: Array<Question<S>>
	retour: () => void
}

export const QuestionCourante = ({ questions, retour }: Props) => {
	const { t } = useTranslation()

	return (
		<>
			<Button light size="XS" onPress={retour}>
				<ReturnLeftIcon />
				{t(
					'components.simulateur.zone-de-saisie.situation.retour',
					'Revenir à la liste'
				)}
			</Button>

			{questions.map((Question) => (
				<React.Fragment key={Question.id}>
					{Question._tag === 'QuestionFournie' && (
						<fieldset>
							<QuestionTitle as="legend">{Question.libellé(t)}</QuestionTitle>
							<Question />
						</fieldset>
					)}

					{Question._tag === 'QuestionPublicodes' && (
						<QuestionPublicodes question={Question} />
					)}
				</React.Fragment>
			))}
		</>
	)
}

const QuestionTitle = styled(H3)`
	margin-top: 0;
`
