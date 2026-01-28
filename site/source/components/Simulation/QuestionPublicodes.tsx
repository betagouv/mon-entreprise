import * as O from 'effect/Option'
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { H3 } from '@/design-system'
import {
	PublicodesAdapter,
	ValeurPublicodes,
} from '@/domaine/engine/PublicodesAdapter'
import { isMontant } from '@/domaine/Montant'
import { DottedName } from '@/domaine/publicodes/DottedName'
import { isQuantité } from '@/domaine/Quantité'
import { Situation } from '@/domaine/Situation'
import { isUnitéMonétaire, isUnitéQuantité } from '@/domaine/Unités'
import { QuestionPublicodes as TypeQuestionPublicodes } from '@/hooks/useQuestions'
import { enregistreLaRéponseÀLaQuestion } from '@/store/actions/actions'
import { useEngine } from '@/utils/publicodes/EngineContext'
import { evaluateQuestion } from '@/utils/publicodes/publicodes'

import { ExplicableRule } from '../conversation/Explicable'
import RuleInput, {
	getRuleInputNature,
	OUI_NON_INPUT,
	PLUSIEURS_POSSIBILITES,
	UNE_POSSIBILITE,
} from '../conversation/RuleInput'
import { normalizeRuleName } from '../utils/normalizeRuleName'

type Props<S extends Situation> = {
	question: TypeQuestionPublicodes<S>
	handleGoToNext: () => void
}

export const QuestionPublicodes = <S extends Situation>({
	question,
	handleGoToNext,
}: Props<S>) => {
	const dispatch = useDispatch()
	const engine = useEngine()

	const dottedName = question.id
	const rule = engine.getRule(dottedName)
	const evaluation = engine.evaluate({ valeur: dottedName })

	const handleQuestionResponse = useCallback(
		(dottedName: DottedName, value: ValeurPublicodes | undefined) => {
			dispatch(enregistreLaRéponseÀLaQuestion(dottedName, value))
		},
		[dispatch]
	)

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
		dottedName,
		engine,
		{},
		estUnMontant,
		estUneQuantité
	)

	const shouldBeWrappedByFieldset = [
		PLUSIEURS_POSSIBILITES,
		UNE_POSSIBILITE,
		OUI_NON_INPUT,
	].includes(ruleInputNature)

	const questionCouranteLabel = evaluateQuestion(engine, rule)

	const normalizedDottedName = normalizeRuleName(dottedName)

	return shouldBeWrappedByFieldset ? (
		<fieldset>
			<H3 as="legend">
				{questionCouranteLabel}
				<ExplicableRule
					light
					dottedName={dottedName}
					ariaDescribedBy={questionCouranteLabel}
				/>
			</H3>
			<RuleInput
				dottedName={dottedName}
				onChange={(value, name) => handleQuestionResponse(name, value)}
				key={dottedName}
				onSubmit={handleGoToNext}
			/>
		</fieldset>
	) : (
		<>
			<H3 as="label" htmlFor={normalizedDottedName}>
				{questionCouranteLabel}
				<ExplicableRule
					light
					dottedName={dottedName}
					ariaDescribedBy={questionCouranteLabel}
				/>
			</H3>
			<RuleInput
				id={normalizedDottedName}
				dottedName={dottedName}
				onChange={(value, name) => handleQuestionResponse(name, value)}
				key={dottedName}
				onSubmit={handleGoToNext}
			/>
		</>
	)
}
