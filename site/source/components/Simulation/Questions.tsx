import * as O from 'effect/Option'
import React, { useCallback, useRef } from 'react'
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
import { Body, Conversation, H3, Spacing } from '@/design-system'
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
import { enregistreLaRéponseÀLaQuestion } from '@/store/actions/actions'
import { useEngine } from '@/utils/publicodes/EngineContext'
import { evaluateQuestion } from '@/utils/publicodes/publicodes'

import Raccourcis from './Raccourcis'

export interface QuestionsProps<S extends Situation = Situation> {
	situation?: S
	questions?: Array<ComposantQuestion<S>>
	avecQuestionsPublicodes?: boolean
	customEndMessages?: React.ReactNode
}

export function Questions<S extends Situation>({
	questions = [],
	avecQuestionsPublicodes = true,
	customEndMessages,
	situation,
}: QuestionsProps<S>) {
	const { t } = useTranslation()
	const dispatch = useDispatch()
	const engine = useEngine()
	const focusAnchorForA11yRef = useRef<HTMLDivElement>(null)

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
			dispatch(enregistreLaRéponseÀLaQuestion(dottedName, value))
		},
		[dispatch]
	)

	const handleGoToPrevious = useCallback(() => {
		goToPrevious()

		if (focusAnchorForA11yRef.current) {
			focusAnchorForA11yRef.current.focus()
		}
	}, [goToPrevious, focusAnchorForA11yRef])

	const handleGoToNext = useCallback(() => {
		goToNext()

		if (focusAnchorForA11yRef.current) {
			focusAnchorForA11yRef.current.focus()
		}
	}, [goToNext, focusAnchorForA11yRef])

	const handleGoTo = useCallback(
		(index: string) => {
			goTo(index)

			if (focusAnchorForA11yRef.current) {
				focusAnchorForA11yRef.current.focus()
			}
		},
		[goTo, focusAnchorForA11yRef]
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
							onPrevious={handleGoToPrevious}
						/>
					)}

					{!finished && QuestionCourante && (
						<FromTop key={`question-${QuestionCourante.id}`}>
							<div ref={focusAnchorForA11yRef} tabIndex={-1} role="status">
								{QuestionCourante?._tag === 'QuestionFournie' && (
									<fieldset>
										<QuestionTitle as="legend">
											{QuestionCourante.libellé(t)}
										</QuestionTitle>
										<QuestionCourante />
										<Spacing md />
									</fieldset>
								)}

								{QuestionCourante?._tag === 'QuestionPublicodes' && (
									shouldBeWrappedByFieldset ? (
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
												onSubmit={handleGoToNext}
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
												onSubmit={handleGoToNext}
											/>
										</>
									)
								)}
							</div>

							<Conversation
								onPrevious={
									activeQuestionIndex > 0 ? handleGoToPrevious : undefined
								}
								onNext={handleGoToNext}
								questionIsAnswered={questionCouranteRépondue}
								isPreviousDisabled={activeQuestionIndex === 0}
								customVisualisation={
									avecQuestionsPublicodes ? <SeeAnswersButton /> : undefined
								}
							>
								{QuestionCourante?._tag === 'QuestionFournie' && (
									/* Le contenu de la question est rendu par activeCustomQuestion.renderer */
									<div style={{ display: 'none' }}></div>
								)}
							</Conversation>

							{QuestionCourante?._tag === 'QuestionPublicodes' && <Notifications />}
						</FromTop>
					)}

					{QuestionCourante && (
						<Raccourcis
							raccourcis={raccourcis}
							goTo={handleGoTo}
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

const QuestionTitle = styled(H3)`
	margin-top: 0;
`
