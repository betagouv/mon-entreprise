import * as O from 'effect/Option'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { styled } from 'styled-components'

import { ExplicableRule } from '@/components/conversation/Explicable'
import RuleInput, {
	getRuleInputNature,
	OUI_NON_INPUT,
	PLUSIEURS_POSSIBILITES,
	UNE_POSSIBILITE,
} from '@/components/conversation/RuleInput'
import SeeAnswersButton from '@/components/conversation/SeeAnswersButton'
import { VousAvezComplétéCetteSimulation } from '@/components/conversation/VousAvezComplétéCetteSimulation'
import Notifications from '@/components/Notifications'
import { ComposantQuestion } from '@/components/Simulation/ComposantQuestion'
import { FromTop } from '@/components/ui/animate'
import Progress from '@/components/ui/Progress'
import { useEngine } from '@/components/utils/EngineContext'
import { Body, Conversation, H3 } from '@/design-system'
import {
	PublicodesAdapter,
	ValeurPublicodes,
} from '@/domaine/engine/PublicodesAdapter'
import { isMontant } from '@/domaine/Montant'
import { DottedName } from '@/domaine/publicodes/DottedName'
import { isQuantité } from '@/domaine/Quantité'
import { Situation } from '@/domaine/Situation'
import { isUnitéMonétaire, isUnitéQuantité } from '@/domaine/Unités'
import { useQuestions } from '@/hooks/useQuestions'
import { enregistreLaRéponse } from '@/store/actions/actions'
import { evaluateQuestion } from '@/utils/publicodes/publicodes'

import Raccourcis from './Raccourcis'

export interface QuestionsProps<S extends Situation = Situation> {
	situation?: S
	questions?: Array<ComposantQuestion<S>>
	avecQuestionsPublicodes?: boolean
	customEndMessages?: React.ReactNode
	customSituationVisualisation?: React.ReactNode
}

export function Questions<S extends Situation>({
	questions = [],
	avecQuestionsPublicodes = true,
	customEndMessages,
	customSituationVisualisation,
	situation,
}: QuestionsProps<S>) {
	const { t } = useTranslation()
	const dispatch = useDispatch()
	const engine = useEngine()

	const {
		nombreDeQuestions,
		nombreDeQuestionsRépondues,
		activeQuestionIndex,
		QuestionCourante,
		questionCouranteRépondue,
		raccourcis,
		finished,
		goToNext,
		goToPrevious,
		goTo,
	} = useQuestions({
		questions,
		situation,
		avecQuestionsPublicodes,
	})

	const handlePublicodesQuestionResponse = useCallback(
		(dottedName: DottedName, value: ValeurPublicodes | undefined) => {
			dispatch(enregistreLaRéponse(dottedName, value))
		},
		[dispatch]
	)

	let shouldBeWrappedByFieldset = false
	if (!finished && QuestionCourante?._tag === 'QuestionPublicodes') {
		const dottedName = QuestionCourante.id
		const rule = engine.getRule(dottedName)
		const evaluation = engine.evaluate({ valeur: dottedName })

		const decoded: O.Option<ValeurPublicodes> =
			PublicodesAdapter.decode(evaluation)
		const value = O.getOrUndefined(decoded)

		const unitéPublicodes = rule.rawNode.unité

		const estUnMontant = Boolean(
			(value && isMontant(value)) || isUnitéMonétaire(unitéPublicodes)
		)

		const estUneQuantité = Boolean(
			(value && isQuantité(value)) || isUnitéQuantité(unitéPublicodes)
		)

		const ruleInputNature = getRuleInputNature(
			QuestionCourante.id,
			engine,
			{},
			estUnMontant,
			estUneQuantité
		)

		shouldBeWrappedByFieldset = [
			PLUSIEURS_POSSIBILITES,
			UNE_POSSIBILITE,
			OUI_NON_INPUT,
		].includes(ruleInputNature)
	}

	const questionCouranteHtmlForId = QuestionCourante?.id
		.replaceAll(' . ', '_')
		.replaceAll(' ', '-')

	const questionCouranteLabel =
		QuestionCourante?._tag === 'QuestionPublicodes'
			? evaluateQuestion(engine, engine.getRule(QuestionCourante.id))
			: undefined

	return (
		nombreDeQuestions > 0 && (
			<>
				<Progress
					progress={activeQuestionIndex + 1}
					maxValue={nombreDeQuestions}
				/>
				<QuestionsContainer>
					<div className="print-hidden">
						{nombreDeQuestionsRépondues < nombreDeQuestions && (
							<Body>
								{t(
									'simulateurs.précision.défaut',
									'Améliorez votre simulation en répondant aux questions :'
								)}
							</Body>
						)}
					</div>
					{finished && (
						<VousAvezComplétéCetteSimulation
							customEndMessages={customEndMessages}
							onPrevious={goToPrevious}
						/>
					)}

					{!finished && QuestionCourante?._tag === 'QuestionFournie' && (
						<FromTop key={`custom-question-${QuestionCourante.id}`}>
							<QuestionTitle>{QuestionCourante.libellé}</QuestionTitle>
							<QuestionCourante />

							<Conversation
								onPrevious={activeQuestionIndex > 0 ? goToPrevious : undefined}
								onNext={goToNext}
								questionIsAnswered={questionCouranteRépondue}
								isPreviousDisabled={activeQuestionIndex === 0}
								customVisualisation={
									<SeeAnswersButton>
										{customSituationVisualisation}
									</SeeAnswersButton>
								}
							>
								{/* Le contenu de la question est rendu par activeCustomQuestion.renderer */}
								<div style={{ display: 'none' }}></div>
							</Conversation>
						</FromTop>
					)}

					{!finished && QuestionCourante?._tag === 'QuestionPublicodes' && (
						<FromTop key={`publicodes-question-${QuestionCourante.id}`}>
							{shouldBeWrappedByFieldset ? (
								<fieldset>
									<H3 as="legend">
										{questionCouranteLabel}
										<ExplicableRule
											light
											dottedName={QuestionCourante.id}
											ariaDescribedBy={questionCouranteLabel}
										/>
									</H3>
									<RuleInput
										dottedName={QuestionCourante.id}
										onChange={(value, name) =>
											handlePublicodesQuestionResponse(name, value)
										}
										key={QuestionCourante.id}
										onSubmit={goToNext}
									/>
								</fieldset>
							) : (
								<>
									<H3 as="label" htmlFor={questionCouranteHtmlForId}>
										{questionCouranteLabel}
										<ExplicableRule
											light
											dottedName={QuestionCourante.id}
											ariaDescribedBy={questionCouranteLabel}
										/>
									</H3>
									<RuleInput
										id={questionCouranteHtmlForId}
										dottedName={QuestionCourante.id}
										onChange={(value, name) =>
											handlePublicodesQuestionResponse(name, value)
										}
										key={QuestionCourante.id}
										onSubmit={goToNext}
									/>
								</>
							)}
							<Conversation
								onPrevious={activeQuestionIndex > 0 ? goToPrevious : undefined}
								onNext={goToNext}
								questionIsAnswered={questionCouranteRépondue}
								isPreviousDisabled={activeQuestionIndex === 0}
								customVisualisation={
									<SeeAnswersButton>
										{customSituationVisualisation}
									</SeeAnswersButton>
								}
							/>
							<Notifications />
						</FromTop>
					)}

					{QuestionCourante && (
						<Raccourcis
							raccourcis={raccourcis}
							goTo={goTo}
							idQuestionCourante={QuestionCourante?.id}
						/>
					)}
				</QuestionsContainer>
			</>
		)
	)
}

const QuestionsContainer = styled.div`
	padding: ${({ theme }) => ` ${theme.spacings.xs} ${theme.spacings.lg}`};
	border-radius: ${({ theme }) =>
		`0 0 ${theme.box.borderRadius} ${theme.box.borderRadius}`};
	background-color: ${({ theme }) =>
		theme.darkMode
			? theme.colors.extended.grey[700]
			: theme.colors.extended.grey[100]};
	box-shadow: ${({ theme }) => theme.elevations[2]};
`

const QuestionTitle = styled.h3`
	margin-top: 0;
	margin-bottom: 1rem;
	font-weight: 500;
`
