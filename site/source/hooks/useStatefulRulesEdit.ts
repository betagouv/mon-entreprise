import { pipe, Record } from 'effect'
import * as R from 'effect/Record'
import { DottedName } from 'modele-social'
import { Evaluation } from 'publicodes'
import { useState } from 'react'
import { useDispatch } from 'react-redux'

import { useEngine } from '@/components/utils/EngineContext'
import { PublicodesAdapter } from '@/domaine/engine/PublicodesAdapter'
import { SimpleRuleEvaluation } from '@/domaine/engine/SimpleRuleEvaluation'
import { ajusteLaSituation } from '@/store/actions/actions'

export const useStatefulRulesEdit = <T extends DottedName>(
	rules: ReadonlyArray<T>
) => {
	const dispatch = useDispatch()
	const engine = useEngine()

	const engineValues = (): Record<T, SimpleRuleEvaluation> =>
		pipe<Record<T, Evaluation>, Record<T, SimpleRuleEvaluation>>(
			R.fromIterableWith(rules, (rule) => [
				rule,
				engine.evaluate(rule).nodeValue,
			]) as Record<T, Evaluation>,
			R.map((nodeValue: Evaluation, rule: T) =>
				PublicodesAdapter.decode(rule, nodeValue as SimpleRuleEvaluation)
			)
		)

	const [dirtyValues, setDirtyValues] = useState(engineValues())

	const read = R.map(
		dirtyValues,
		(_, rule: T) => () => dirtyValues[rule]
	) as Record<T, () => SimpleRuleEvaluation>

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
				R.map(dirtyValues, (dirtyValue, rule) =>
					PublicodesAdapter.encode(rule, dirtyValue)
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
