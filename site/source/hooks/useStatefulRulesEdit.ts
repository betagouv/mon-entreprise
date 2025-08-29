import { pipe, Record } from 'effect'
import * as O from 'effect/Option'
import * as R from 'effect/Record'
import { DottedName } from 'modele-social'
import { EvaluatedNode } from 'publicodes'
import { useState } from 'react'
import { useDispatch } from 'react-redux'

import { useEngine } from '@/components/utils/EngineContext'
import { OuiNonAdapter } from '@/domaine/engine/OuiNonAdapter'
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

	const [values, setValues] = useState(engineValues())

	const read = R.map(
		values,
		(_, rule: T) => () => O.getOrUndefined(values[rule])
	) as Record<T, () => ValeurPublicodes | undefined>

	const set = R.map(
		values,
		(_, rule) => (newValue: string | boolean | undefined) => {
			const valeurPublicodes =
				typeof newValue === 'string'
					? O.some(newValue)
					: OuiNonAdapter.decode(newValue)
			setValues({
				...values,
				[rule]: valeurPublicodes,
			})
		}
	) as Record<T, (newValue: string | boolean | undefined) => void>

	const cancel = () => {
		setValues(engineValues())
	}

	const confirm = () => {
		dispatch(
			ajusteLaSituation(
				pipe<
					Record<T, O.Option<ValeurPublicodes>>,
					Record<T, ValeurPublicodes | undefined>,
					Record<T, ValeurPublicodes>
				>(
					values,
					R.map<T, O.Option<ValeurPublicodes>, ValeurPublicodes | undefined>(
						O.getOrUndefined
					),
					filterRecordNotUndefined
				)
			)
		)
	}

	return {
		values,
		read,
		set,
		cancel,
		confirm,
	}
}

const filterRecordNotUndefined = <T, K extends string = string>(
	r: Record<K, T | undefined>
) => R.filter(r, (v: T | undefined): v is T => v !== undefined) as Record<K, T>
