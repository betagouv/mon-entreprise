import { pipe, Record } from 'effect'
import * as O from 'effect/Option'
import * as R from 'effect/Record'
import { EvaluatedNode, PublicodesExpression } from 'publicodes'
import { useMemo } from 'react'
import { useDispatch } from 'react-redux'

import {
	PublicodesAdapter,
	ValeurPublicodes,
} from '@/domaine/engine/PublicodesAdapter'
import { DottedName } from '@/domaine/publicodes/DottedName'
import { ajusteLaSituation } from '@/store/actions/actions'
import { useEngine } from '@/utils/publicodes/EngineContext'

export const useStatefulRulesEdit = (
	rules: ReadonlyArray<DottedName>,
	contexte: PublicodesExpression = {}
) => {
	const dispatch = useDispatch()
	const engine = useEngine()

	const engineValues = useMemo(
		(): Record<DottedName, O.Option<ValeurPublicodes>> =>
			pipe<
				Record<DottedName, EvaluatedNode>,
				Record<DottedName, O.Option<ValeurPublicodes>>
			>(
				R.fromIterableWith(rules, (rule) => [
					rule,
					engine.evaluate({
						valeur: rule,
						contexte,
					}),
				]) as Record<DottedName, EvaluatedNode>,
				R.map((node: EvaluatedNode) => PublicodesAdapter.decode(node))
			),
		[rules, contexte, engine]
	)

	const values = useMemo(
		() =>
			pipe<
				Record<DottedName, O.Option<ValeurPublicodes>>,
				Record<DottedName, ValeurPublicodes | undefined>
			>(
				engineValues,
				R.map<
					DottedName,
					O.Option<ValeurPublicodes>,
					ValeurPublicodes | undefined
				>(O.getOrUndefined)
			),
		[engineValues]
	)

	const set = R.map(engineValues, (_, rule) => (newValue: ValeurPublicodes) => {
		const newValues = pipe(
			{
				...engineValues,
				[rule]: O.some(newValue),
			},
			R.map<
				DottedName,
				O.Option<ValeurPublicodes>,
				ValeurPublicodes | undefined
			>(O.getOrUndefined)
		)
		dispatch(ajusteLaSituation(newValues))
	}) as Record<DottedName, (newValue: string | boolean | undefined) => void>

	return {
		values,
		set,
	}
}
