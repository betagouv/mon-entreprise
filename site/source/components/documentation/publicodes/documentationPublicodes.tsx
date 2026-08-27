import Engine from 'publicodes'

import { DocumentationDeValeur } from '@/domaine/documentation/DocumentationDeValeur'
import { DottedName } from '@/domaine/publicodes/DottedName'

import { RéférencesDeRègle } from './ReferencesDeRegle'
import { RésuméDeRègle } from './ResumeDeRegle'

export const documentationPublicodes = (
	engine: () => Engine<DottedName>,
	dottedName: DottedName
): DocumentationDeValeur => ({
	Résumé: () => <RésuméDeRègle engine={engine} dottedName={dottedName} />,
	Références: () => (
		<RéférencesDeRègle engine={engine} dottedName={dottedName} />
	),
})
