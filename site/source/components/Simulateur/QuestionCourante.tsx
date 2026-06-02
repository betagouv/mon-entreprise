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
			<StyledButton light size="XS" onPress={retour}>
				<ReturnIconLeft />
				{t(
					'components.simulateur.zone-de-saisie.situation.retour',
					'Revenir à la liste'
				)}
			</StyledButton>

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

// TODO: vérifier les couleurs une fois #4464 mergée
const StyledButton = styled(Button)`
	display: flex;
	align-items: center;
	gap: 0 ${({ theme }) => theme.spacings.xs};
`

const QuestionTitle = styled(H3)`
	margin-top: 0;
`
