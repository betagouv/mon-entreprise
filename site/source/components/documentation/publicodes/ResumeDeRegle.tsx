import Engine from 'publicodes'

import { Markdown } from '@/design-system'
import { DottedName } from '@/domaine/publicodes/DottedName'

type Props = {
	engine: () => Engine<DottedName>
	dottedName: DottedName
}

export const RésuméDeRègle = ({ engine, dottedName }: Props) => {
	const { description } = engine().getRule(dottedName).rawNode

	if (description == null) {
		return null
	}

	return <Markdown>{description}</Markdown>
}
