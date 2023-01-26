export type ValueType =
	| string
	| number
	| boolean
	| null
	| Record<string, unknown>
export type BestOption = {
	type: 'sasu' | 'ei' | 'ae'
	value?: ValueType
}
export const getBestOption = (options: BestOption[]) => {
	const sortedOptions = options.sort(
		(option1: BestOption, option2: BestOption) => {
			if (option1.value === null || option1.value === undefined) {
				return 1
			}
			if (option2.value === null || option2.value === undefined) {
				return -1
			}

			if (option1.value === option2.value) return 0
			// console.log(option1.value, option2.value, option1.value > option2.value)

			return option1.value > option2.value ? -1 : 1
		}
	)

	return sortedOptions?.[0]?.type
}
