import Engine, { Evaluation } from 'publicodes'

import { StatutType } from '@/components/StatutTag'
import { DottedName } from '@/domaine/publicodes/DottedName'

export type OptionType = {
	engine: Engine<DottedName>
	name: StatutType
	value: Evaluation
}
export const getBestOption = (options: OptionType[], leastIsBest: boolean) => {
	const sortedOptions = [...options].sort(
		(option1: OptionType, option2: OptionType) => {
			if (option1.value === null || option1.value === undefined) {
				return leastIsBest ? -1 : 1
			}
			if (option2.value === null || option2.value === undefined) {
				return leastIsBest ? 1 : -1
			}

			if (option1.value === option2.value) return 0

			return (option1.value > option2.value ? -1 : 1) * (leastIsBest ? -1 : 1)
		}
	)

	return sortedOptions?.[0]?.name
}
