import { DottedName } from 'modele-social'
import Engine, { Evaluation } from 'publicodes'

import { StatutType } from '@/components/StatutTag'

export type OptionType = {
	engine: Engine<DottedName>
	name: StatutType
	value: Evaluation
}
