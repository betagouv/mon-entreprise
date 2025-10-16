import Engine, { Evaluation } from 'publicodes'

import { StatutType } from '@/components/StatutTag'
import { DottedName } from '@/domaine/publicodes/DottedName'

export type OptionType = {
	engine: Engine<DottedName>
	name: StatutType
	value: Evaluation
}
