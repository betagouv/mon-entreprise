import { DottedName } from 'modele-social'
import { useEngine } from '@/components/utils/EngineContext'
import { isEmpty } from 'ramda'

export function useProgress(objectifs: DottedName[]): number {
	const engine = useEngine()
	const evaluatedObjectifs = objectifs.map((dottedName) => ({
		...engine.evaluate(dottedName),
		dottedName,
	}))
	const objectifsApplicables = evaluatedObjectifs.filter(
		(objectif) => objectif.nodeValue !== null
	)
	const objectifsRemplis = objectifsApplicables.filter((objectif) =>
		isEmpty(objectif.missingVariables)
	)

	if (!objectifsApplicables.length) {
		return 0
	}

	return objectifsRemplis.length / objectifsApplicables.length
}
