import { DottedName } from 'modele-social'

import { useEngine } from '@/components/utils/EngineContext'
import { RèglePublicodeAdapter } from '@/domaine/engine/RèglePublicodeAdapter'

export function usePublicodes() {
	const engine = useEngine()

	const évalue = (dottedName: DottedName) => {
		const evaluation = engine.evaluate(dottedName)

		return {
			valeur: RèglePublicodeAdapter.decode(evaluation),
			parDéfaut: (dottedName in evaluation.missingVariables) satisfies boolean,
		}
	}

	return {
		évalue,
	}
}
