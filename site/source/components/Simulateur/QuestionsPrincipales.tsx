import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { ArrowRightIcon, Body, Button } from '@/design-system'
import { Situation } from '@/domaine/Situation'
import { Question } from '@/hooks/useQuestionsEditorialisees'

import ScrollToElement from '../utils/Scroll/ScrollToElement'
import { QuestionCourante } from './QuestionCourante'

type Props<S extends Situation> = {
	questions: Question<S>[]
	onClose: () => void
	situationMinimaleSaisie?: boolean
}

export const QuestionsPrincipales = <S extends Situation = Situation>({
	questions,
	onClose,
	situationMinimaleSaisie = true,
}: Props<S>) => {
	const { t } = useTranslation()

	return (
		<>
			<ScrollToElement>
				<QuestionCourante questions={questions} />
			</ScrollToElement>

			{situationMinimaleSaisie && (
				<StyledDiv>
					<Body>
						{t(
							'components.simulateur.zone-de-saisie.situation.questions-principales.texte',
							'Pour une meilleure simulation, vous pouvez préciser votre situation.'
						)}
					</Body>
					<Button size="XS" color="secondary" onPress={onClose}>
						{t(
							'components.simulateur.zone-de-saisie.situation.questions-principales.bouton',
							'Préciser votre situation'
						)}
						<ArrowRightIcon />
					</Button>
				</StyledDiv>
			)}
		</>
	)
}

const StyledDiv = styled.div`
	border-top: solid 1px ${({ theme }) => theme.colors.extended.grey[300]};
	margin: ${({ theme }) => theme.spacings.xl} 0;
`
