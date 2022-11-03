import { DottedName } from 'modele-social'
import { RuleNode } from 'publicodes'

import { useEngine } from '@/components/utils/EngineContext'

export function useProgress(objectifs: DottedName[]): number {
	const engine = useEngine()
	const evaluatedObjectifs = objectifs.map((dottedName) => ({
		...engine.evaluate(dottedName),
		dottedName,
	}))
	const objectifsApplicables = evaluatedObjectifs.filter(
		(objectif) => objectif.nodeValue !== null
	)
	const objectifsRemplis = objectifsApplicables.filter(
		(objectif) => Object.keys(objectif.missingVariables).length === 0
	)

	if (!objectifsApplicables.length) {
		return 0
	}

	return objectifsRemplis.length / objectifsApplicables.length
}

export function useApplicableFields(
	dottedNameOrRegexp: DottedName | RegExp
): Array<[DottedName, RuleNode]> {
	const engine = useEngine()
	const fields = (
		Object.entries(engine.getParsedRules()) as Array<[DottedName, RuleNode]>
	)
		.filter(([dottedName]) =>
			typeof dottedNameOrRegexp === 'string'
				? dottedName.startsWith(dottedNameOrRegexp)
				: dottedName.match(dottedNameOrRegexp)
		)
		.filter(
			([dottedName]) =>
				engine.evaluate({ 'est applicable': dottedName }).nodeValue === true
		)

	return fields
}
