export type ChoiceDisplayType = 'radio' | 'card' | 'toggle' | 'select'

export interface ChoiceOption {
	key: string
	value: string
	label: string
	description?: string
	emoji?: string
	isDefaultSelected?: boolean
	isDisabled?: boolean
	precision?: number
}
