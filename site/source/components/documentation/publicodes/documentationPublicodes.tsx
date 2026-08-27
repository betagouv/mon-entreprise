import Engine from 'publicodes'
import { PropsWithChildren } from 'react'

import RuleLink from '@/components/RuleLink'
import { DocumentationDeValeur } from '@/domaine/documentation/DocumentationDeValeur'
import { DottedName } from '@/domaine/publicodes/DottedName'

import { RéférencesDeRègle } from './ReferencesDeRegle'
import { RésuméDeRègle } from './ResumeDeRegle'

export const documentationPublicodes = (
	engine: () => Engine<DottedName>,
	dottedName: DottedName,
	espaceDeDocumentation?: string
): DocumentationDeValeur => ({
	Résumé: () => <RésuméDeRègle engine={engine} dottedName={dottedName} />,
	Références: () => (
		<RéférencesDeRègle engine={engine} dottedName={dottedName} />
	),
	Lien: ({ children }: PropsWithChildren) => (
		<RuleLink
			documentationPath={espaceDeDocumentation}
			engine={engine()}
			dottedName={dottedName}
		>
			{children}
		</RuleLink>
	),
})
