import Engine, { utils } from 'publicodes'

import { DottedName } from '@/domaine/publicodes/DottedName'

import { ReferencesList } from './ReferencesList'

export function References({
	references,
	dottedName,
	engine,
}: {
	references?: Record<string, string>
	dottedName?: DottedName | undefined
	engine?: Engine<DottedName>
}): JSX.Element | null {
	if (references) {
		return <ReferencesList references={references} />
	}

	if (!dottedName || !engine) {
		return null
	}

	// If no reference, check if parent has some that we could use
	const parentRule = utils.ruleParent(dottedName as string) as DottedName
	if (!parentRule) {
		return null
	}
	const parentRefences =
		engine.baseContext.parsedRules[parentRule].rawNode.références
	/* TODO à remplacer une fois que https://github.com/publicodes/publicodes/issues/613
	 *  par un truc plus propre du genre const parentReferences = engine.dev.getRule(parentRule).références
	 */

	if (!parentRefences) {
		return null
	}

	return <ReferencesList references={parentRefences} />
}
