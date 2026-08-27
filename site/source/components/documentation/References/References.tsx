import Engine, { utils } from 'publicodes'
import type { JSX } from 'react'

import { DottedName } from '@/domaine/publicodes/DottedName'

import { ListeDeRéférences } from './ListeDeReferences'
import type { Références as CollectionDeRéférences } from './references'

export function Références({
	références,
	dottedName,
	engine,
}: {
	références?: CollectionDeRéférences
	dottedName?: DottedName | undefined
	engine?: Engine<DottedName>
}): JSX.Element | null {
	if (références) {
		return <ListeDeRéférences références={références} />
	}

	if (!dottedName || !engine) {
		return null
	}

	// If no reference, check if parent has some that we could use
	const parentRule = utils.ruleParent(dottedName as string) as DottedName
	if (!parentRule) {
		return null
	}
	const référencesDeLaRègleParente =
		engine.baseContext.parsedRules[parentRule].rawNode.références
	/* TODO à remplacer une fois que https://github.com/publicodes/publicodes/issues/613
	 *  par un truc plus propre du genre const parentReferences = engine.dev.getRule(parentRule).références
	 */

	if (!référencesDeLaRègleParente) {
		return null
	}

	return <ListeDeRéférences références={référencesDeLaRègleParente} />
}
