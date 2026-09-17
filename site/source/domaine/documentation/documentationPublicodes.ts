import Engine, { utils } from 'publicodes'

import { DocumentationDeValeur } from '@/domaine/documentation/DocumentationDeValeur'
import { DottedName } from '@/domaine/publicodes/DottedName'

export const documentationPublicodes = (
	engine: () => Engine<DottedName>,
	dottedName: DottedName,
	pathSegment?: string
): DocumentationDeValeur => ({
	titre: () => engine().getRule(dottedName).title,
	chemin: [pathSegment, utils.encodeRuleName(dottedName)]
		.filter(Boolean)
		.join('/'),
})
