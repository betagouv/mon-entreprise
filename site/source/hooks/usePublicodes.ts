import { DottedName } from 'modele-social'

import { useEngine } from '@/components/utils/EngineContext'
import { PublicodesAdapter } from '@/domaine/engine/PublicodesAdapter'

export function usePublicodes() {
	const engine = useEngine()

	const évalue = (dottedName: DottedName) => {
		const evaluation = engine.evaluate(dottedName)

		return {
			valeur: PublicodesAdapter.decode(evaluation),
			parDéfaut: (dottedName in evaluation.missingVariables) satisfies boolean,
		}
	}

	return {
		évalue,
	}
}
