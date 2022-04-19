import { useEngine } from '@/components/utils/EngineContext'
import { DottedName } from 'modele-social'
import { RuleNode } from 'publicodes'
import { isEmpty } from 'ramda'
import { useMemo } from 'react'

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

export function useApplicableFields(
	dottedNameOrRegexp: DottedName | RegExp
): Array<[DottedName, RuleNode]> {
	const engine = useEngine()
	const fields = useMemo(
		() =>
			(Object.entries(engine.getParsedRules()) as Array<[DottedName, RuleNode]>)
				.filter(([dottedName]) =>
					typeof dottedNameOrRegexp === 'string'
						? dottedName.startsWith(dottedNameOrRegexp)
						: dottedName.match(dottedNameOrRegexp)
				)
				.filter(
					([dottedName]) => engine.evaluate(dottedName).nodeValue !== null
				),
		[engine.parsedSituation]
	)

	return fields
}
