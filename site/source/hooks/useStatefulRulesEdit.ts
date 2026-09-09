import { pipe, Record } from 'effect'
import * as O from 'effect/Option'
import * as R from 'effect/Record'
import { DottedName } from 'modele-social'
import { EvaluatedNode, PublicodesExpression } from 'publicodes'
import { useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'

import { useEngine } from '@/components/utils/EngineContext'
import {
	PublicodesAdapter,
	ValeurPublicodes,
} from '@/domaine/engine/PublicodesAdapter'
import { ajusteLaSituation } from '@/store/actions/actions'

export const useStatefulRulesEdit = <T extends DottedName>(
	rules: ReadonlyArray<T>,
	contexte?: PublicodesExpression
) => {
	const dispatch = useDispatch()
	const engine = useEngine()

	const engineValues = useMemo(
		(): Record<T, O.Option<ValeurPublicodes>> =>
			pipe<Record<T, EvaluatedNode>, Record<T, O.Option<ValeurPublicodes>>>(
				R.fromIterableWith(rules, (rule) => [
					rule,
					engine.evaluate({
						valeur: rule,
						contexte,
					}),
				]) as Record<T, EvaluatedNode>,
				R.map((node: EvaluatedNode) => PublicodesAdapter.decode(node))
			),
		[rules, contexte, engine]
	)

	const [dirtyValues, setValues] = useState(engineValues)

	const values = pipe<
		Record<T, O.Option<ValeurPublicodes>>,
		Record<T, ValeurPublicodes | undefined>
	>(
		dirtyValues,
		R.map<T, O.Option<ValeurPublicodes>, ValeurPublicodes | undefined>(
			O.getOrUndefined
		)
	)

	const set = R.map(dirtyValues, (_, rule) => (newValue: ValeurPublicodes) => {
		setValues({
			...dirtyValues,
			[rule]: O.some(newValue),
		})
	}) as Record<T, (newValue: string | boolean | undefined) => void>

	const cancel = () => setValues(engineValues)

	const confirm = () => {
		dispatch(
			ajusteLaSituation(
				pipe<
					Record<T, ValeurPublicodes | undefined>,
					Record<T, ValeurPublicodes>
				>(values, filterRecordNotUndefined)
			)
		)
	}

	return {
		values,
		set,
		cancel,
		confirm,
	}
}

const filterRecordNotUndefined = <T, K extends string = string>(
	r: Record<K, T | undefined>
) => R.filter(r, (v: T | undefined): v is T => v !== undefined) as Record<K, T>
