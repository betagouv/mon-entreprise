import { Option } from 'effect/Option'

import {
	PublicodesAdapter,
	ValeurPublicodes,
} from '@/domaine/engine/PublicodesAdapter'
import { DottedName } from '@/domaine/publicodes/DottedName'
import { useEngine } from '@/utils/publicodes/EngineContext'

export function usePublicodes() {
	const engine = useEngine()
	const rules = engine.getParsedRules()

	const contientLaRègle = (dottedName: DottedName) => dottedName in rules

	const évalue = <T extends ValeurPublicodes>(dottedName: DottedName) => {
		const evaluation = engine.evaluate(dottedName)

		return {
			valeur: PublicodesAdapter.decode(evaluation) as Option<T>,
			parDéfaut: (dottedName in evaluation.missingVariables) satisfies boolean,
		}
	}

	return {
		contientLaRègle,
		évalue,
	}
}
