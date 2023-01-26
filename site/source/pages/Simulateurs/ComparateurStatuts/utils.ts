import Engine from 'publicodes'

import { DottedName } from '@/../../modele-social'

export type ValueType =
	| string
	| number
	| boolean
	| null
	| Record<string, unknown>
export type OptionType = {
	type: 'sasu' | 'ei' | 'ae'
	value?: ValueType
	engine?: Engine<DottedName>
	documentationPath?: string
}
export const getBestOption = (options: OptionType[]) => {
	const sortedOptions = [...options].sort(
		(option1: OptionType, option2: OptionType) => {
			if (option1.value === null || option1.value === undefined) {
				return 1
			}
			if (option2.value === null || option2.value === undefined) {
				return -1
			}

			if (option1.value === option2.value) return 0

			return option1.value > option2.value ? -1 : 1
		}
	)

	return sortedOptions?.[0]?.type
}
