import { pipe } from 'effect'
import { map } from 'effect/Array'
import * as R from 'effect/Record'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { Body, Button, EditIcon, Li, Ul } from '@/design-system'
import { Situation } from '@/domaine/Situation'
import { GroupeDeQuestions } from '@/hooks/useQuestionsEditorialisees'

import { ExplicableRule } from '../conversation/Explicable'
import { BoutonReset } from './BoutonReset'
import { BoutonRetour } from './BoutonRetour'

type Props<S extends Situation> = {
	groupesDeQuestions: Record<string, GroupeDeQuestions<S>>
	onSélection: (questionId: string) => void
	retour: () => void
	onReset?: () => void
}

export const ListeQuestions = <S extends Situation = Situation>({
	groupesDeQuestions,
	onSélection,
	retour,
	onReset,
}: Props<S>) => {
	const { t } = useTranslation()

	if (Object.keys(groupesDeQuestions).length === 0) {
		return null
	}

	return (
		<>
			<BoutonsContainer>
				<BoutonRetour onPress={retour} />
				<BoutonReset onReset={onReset} />
			</BoutonsContainer>

			<UlWithoutMargin $noMarker>
				{pipe(
					groupesDeQuestions,
					R.toEntries,
					map(([id, groupe]) => {
						const premièreQuestion = groupe.liste[0]
						const estPublicodes = premièreQuestion._tag === 'QuestionPublicodes'

						return (
							<StyledLi key={id}>
								<div>
									<BodyWithoutMargin>{groupe.titre(t)}</BodyWithoutMargin>
									{estPublicodes && (
										<ExplicableRule dottedName={premièreQuestion.id} />
									)}
								</div>

								<ValueContainer>
									<premièreQuestion.Valeur />
									<EditButton
										light
										onPress={() => onSélection(id)}
										aria-label={t(
											'components.simulateur.questions.modifier',
											'Modifier {{ règle }}',
											{ règle: groupe.titre(t) }
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
		</>
	)
}

const BoutonsContainer = styled.div`
	padding: ${({ theme }) => theme.spacings.xs} 0
		${({ theme }) => theme.spacings.md} 0;
	display: flex;
	justify-content: space-between;
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
