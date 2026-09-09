import { DottedName } from 'modele-social'
import Engine from 'publicodes'

import { StatutType } from '@/components/StatutTag'

export type NamedEngine = {
	engine: Engine<DottedName>
	name: StatutType
}
