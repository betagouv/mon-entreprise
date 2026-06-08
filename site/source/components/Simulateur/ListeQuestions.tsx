import { pipe } from 'effect'
import { map } from 'effect/Array'
import * as R from 'effect/Record'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { Body, Button, EditIcon, Li, Ul } from '@/design-system'
import { DottedName } from '@/domaine/publicodes/DottedName'
import { Situation } from '@/domaine/Situation'
import { QuestionsGroupées } from '@/hooks/useQuestionsEditorialisees'

import { ExplicableRule } from '../conversation/Explicable'
import Value from '../EngineValue/Value'
import { BoutonReset } from './BoutonReset'

export type QuestionEnListe = {
	id: DottedName
	label: string
	répondue: boolean
}

type Props<S extends Situation = Situation> = {
	questionsGroupées: Record<string, QuestionsGroupées<S>>
	onSélection: (questionId: string) => void
}

export const ListeQuestions = ({ questionsGroupées, onSélection }: Props) => {
	const { t } = useTranslation()

	return (
		<>
			<BoutonsContainer>
				<BoutonReset />
			</BoutonsContainer>

			{Object.keys(questionsGroupées).length && (
				<UlWithoutMargin $noMarker>
					{pipe(
						questionsGroupées,
						R.toEntries,
						map(([id, questionGroupée]) => {
							const question = questionGroupée.liste[0]

							return (
								<StyledLi key={id}>
									<div>
										<BodyWithoutMargin>{question.libellé(t)}</BodyWithoutMargin>
										<ExplicableRule light dottedName={question.id} />
									</div>

									<ValueContainer>
										<Value expression={question.id} linkToRule={false} />
										<EditButton
											light
											onPress={() => onSélection(question.id)}
											aria-label={t(
												'components.simulateur.questions.modifier',
												'Modifier {{ règle }}',
												{ règle: question.libellé(t) }
											)}
										>
											<EditIcon />
										</EditButton>
									</ValueContainer>
								</StyledLi>
							)
						})
					)}
				</UlWithoutMargin>
			)}
		</>
	)
}

const BoutonsContainer = styled.div`
	padding: ${({ theme }) => theme.spacings.xs} 0
		${({ theme }) => theme.spacings.md} 0;
	display: flex;
	justify-content: end;
`

const UlWithoutMargin = styled(Ul)`
	margin: 0;
`

const StyledLi = styled(Li)`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 0 ${({ theme }) => theme.spacings.sm};
	margin: 0 !important;
	padding: ${({ theme }) => theme.spacings.sm} 0;
	&:not(:last-of-type) {
		border-bottom: solid 1px ${({ theme }) => theme.colors.extended.grey[300]};
	}
`

const BodyWithoutMargin = styled(Body)`
	margin: 0;
	display: inline;
`

const ValueContainer = styled.div`
	white-space: nowrap;
	display: flex;
	align-items: center;
	gap: 0 ${({ theme }) => theme.spacings.xxs};
`

const EditButton = styled(Button)`
	border: none;
	svg {
		fill: ${({ theme }) =>
			theme.colors.extended.grey[theme.darkMode ? 100 : 800]};
	}
	font-weight: 700;
	padding: ${({ theme }) => theme.spacings.xxs};
	border-radius: ${({ theme }) => theme.box.borderRadius};
`
