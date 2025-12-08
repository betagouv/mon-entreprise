export type ChoiceDisplayType = 'radio' | 'card' | 'toggle' | 'select'

export type ChoiceOptionWithValue = {
	key: string
	value: string
	label: string
	description?: string
	emoji?: string
	isDefaultSelected?: boolean
	isDisabled?: boolean
	precision?: number
}
type ChoiceOptionWithChildren = {
	children: ChoiceOptionWithValue[]
	label: string
	description?: string
	emoji?: string
}

export type ChoiceOption = ChoiceOptionWithValue | ChoiceOptionWithChildren

export const isChoiceOptionWithValue = (
	choice: ChoiceOption
): choice is ChoiceOptionWithValue => Object.hasOwn(choice, 'value')
