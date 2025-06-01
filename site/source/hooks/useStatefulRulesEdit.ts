import { pipe, Record } from 'effect'
import * as O from 'effect/Option'
import * as R from 'effect/Record'
import { DottedName } from 'modele-social'
import { EvaluatedNode } from 'publicodes'
import { useState } from 'react'
import { useDispatch } from 'react-redux'

import { useEngine } from '@/components/utils/EngineContext'
import {
	PublicodesAdapter,
	ValeurPublicodes,
} from '@/domaine/engine/PublicodesAdapter'
import { ajusteLaSituation } from '@/store/actions/actions'

export const useStatefulRulesEdit = <T extends DottedName>(
	rules: ReadonlyArray<T>
) => {
	const dispatch = useDispatch()
	const engine = useEngine()

	const engineValues = (): Record<T, O.Option<ValeurPublicodes>> =>
		pipe<Record<T, EvaluatedNode>, Record<T, O.Option<ValeurPublicodes>>>(
			R.fromIterableWith(rules, (rule) => [
				rule,
				engine.evaluate(rule),
			]) as Record<T, EvaluatedNode>,
			R.map((node: EvaluatedNode) => PublicodesAdapter.decode(node))
		)

	const [dirtyValues, setDirtyValues] = useState(engineValues())

	const read = R.map(
		dirtyValues,
		(_, rule: T) => () => O.getOrUndefined(dirtyValues[rule])
	) as Record<T, () => ValeurPublicodes | undefined>

	const set = R.map(
		dirtyValues,
		(_, rule) => (newValue: string | boolean | undefined) => {
			setDirtyValues({
				...dirtyValues,
				[rule]: newValue,
			})
		}
	) as Record<T, (newValue: string | boolean | undefined) => void>

	const cancel = () => {
		setDirtyValues(engineValues())
	}

	const confirm = () => {
		dispatch(
			ajusteLaSituation(
				pipe<
					Record<T, O.Option<ValeurPublicodes>>,
					Record<T, ValeurPublicodes | undefined>,
					Record<T, ValeurPublicodes>
				>(
					dirtyValues,
					R.map<T, O.Option<ValeurPublicodes>, ValeurPublicodes | undefined>(
						O.getOrUndefined
					),
					filterRecordNotUndefined
				)
			)
		)
	}

	return {
		values: dirtyValues,
		read,
		set,
		cancel,
		confirm,
	}
}

const filterRecordNotUndefined = <T, K extends string = string>(
	r: Record<K, T | undefined>
) => R.filter(r, (v: T | undefined): v is T => v !== undefined) as Record<K, T>
