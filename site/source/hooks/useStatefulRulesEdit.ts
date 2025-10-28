import { pipe, Record } from 'effect'
import * as O from 'effect/Option'
import * as R from 'effect/Record'
import { EvaluatedNode, PublicodesExpression } from 'publicodes'
import { useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'

import {
	PublicodesAdapter,
	ValeurPublicodes,
} from '@/domaine/engine/PublicodesAdapter'
import { DottedName } from '@/domaine/publicodes/DottedName'
import { useEngine } from '@/hooks/useEngine'
import { ajusteLaSituation } from '@/store/actions/actions'

export const useStatefulRulesEdit = (
	rules: ReadonlyArray<DottedName>,
	contexte?: PublicodesExpression
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

	const [dirtyValues, setValues] = useState(engineValues)

	const values = pipe<
		Record<DottedName, O.Option<ValeurPublicodes>>,
		Record<DottedName, ValeurPublicodes | undefined>
	>(
		dirtyValues,
		R.map<DottedName, O.Option<ValeurPublicodes>, ValeurPublicodes | undefined>(
			O.getOrUndefined
		)
	)

	const set = R.map(dirtyValues, (_, rule) => (newValue: ValeurPublicodes) => {
		setValues({
			...dirtyValues,
			[rule]: O.some(newValue),
		})
	}) as Record<DottedName, (newValue: string | boolean | undefined) => void>

	const cancel = () => setValues(engineValues)

	const confirm = () => {
		dispatch(ajusteLaSituation(values))
	}

	return {
		values,
		set,
		cancel,
		confirm,
	}
}
