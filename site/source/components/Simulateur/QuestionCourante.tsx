import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { Button, H3, ReturnIconLeft } from '@/design-system'
import { Situation } from '@/domaine/Situation'
import { Question } from '@/hooks/useQuestionsV2'

import { QuestionPublicodes } from './QuestionPublicodes'

type Props<S extends Situation = Situation> = {
	Question: Question<S>
	retour: () => void
}

export const QuestionCourante = ({ Question, retour }: Props) => {
	const { t } = useTranslation()

	return (
		<>
			<Button light size="XS" onPress={retour}>
				<ReturnIconLeft />
				{t(
					'components.simulateur.zone-de-saisie.situation.retour',
					'Revenir à la liste'
				)}
			</Button>

			{Question._tag === 'QuestionFournie' && (
				<fieldset>
					<QuestionTitle as="legend">{Question.libellé(t)}</QuestionTitle>
					<Question />
				</fieldset>
			)}

			{Question._tag === 'QuestionPublicodes' && (
				<QuestionPublicodes question={Question} />
			)}
		</>
	)
}

const QuestionTitle = styled(H3)`
	margin-top: 0;
`
