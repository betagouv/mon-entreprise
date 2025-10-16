import Engine from 'publicodes'

import { StatutType } from '@/components/StatutTag'
import { DottedName } from '@/domaine/publicodes/DottedName'

export type NamedEngine = {
	engine: Engine<DottedName>
	name: StatutType
}
