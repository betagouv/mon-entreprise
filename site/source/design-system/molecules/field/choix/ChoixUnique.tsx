import { Key, useCallback, useState } from 'react'

import {
	CardChoiceGroup,
	ChoiceDisplayType,
	RadioChoiceGroup,
	SelectChoiceGroup,
	ToggleChoiceGroup,
} from '../ChoiceGroup'
import { ChoiceOptionWithValue } from '../ChoiceGroup/ChoiceOption'

export type SimpleChoiceOptionWithValue = {
	value: string
	isDefaultSelected?: boolean
	label: string
	description?: string
	emoji?: string
}
type SimpleChoiceOptionWithChildren = {
	children: SimpleChoiceOptionWithValue[]
	label: string
	description?: string
}

export type SimpleChoiceOption =
	| SimpleChoiceOptionWithValue
	| SimpleChoiceOptionWithChildren

const isSimpleChoiceOptionWithValue = (
	choice: SimpleChoiceOption
): choice is SimpleChoiceOptionWithValue => Object.hasOwn(choice, 'value')

export interface ChoixUniqueProps {
	value?: string
	options: SimpleChoiceOption[]
	onChange: (value: string) => void
	id?: string
	title?: string
	description?: string
	autoFocus?: boolean
	variant?: ChoiceDisplayType
	defaultValue?: string
	aria?: {
		label?: string
		labelledby?: string
	}
}

/**
 * Composant de choix unique (boutons radio, cartes, etc.)
 * Version UI pure découplée de Publicodes
 */
export function ChoixUnique({
	value,
	defaultValue,
	options,
	onChange,
	title,
	autoFocus,
	variant = 'radio',
	aria,
}: ChoixUniqueProps) {
	const [currentSelection, setCurrentSelection] = useState<string | undefined>(
		value
	)

	const handleChange = useCallback(
		(val: Key) => {
			const stringVal = val.toString()
			if (!stringVal.length) {
				return
			}
			setCurrentSelection(stringVal)

			onChange(stringVal)
		},
		[onChange]
	)

	const getChoiceOptionWithValue = (
		option: SimpleChoiceOptionWithValue
	): ChoiceOptionWithValue => ({
		key: option.value,
		value: option.value,
		label: option.label,
		description: option.description,
		emoji: option.emoji,
		isDefaultSelected: option.isDefaultSelected || option.value === value,
	})

	const choiceOptions = options.map((option: SimpleChoiceOption) => {
		if (isSimpleChoiceOptionWithValue(option)) {
			return getChoiceOptionWithValue(option)
		}

		return {
			label: option.label,
			description: option.description,
			children: option.children.map((choice) =>
				getChoiceOptionWithValue(choice)
			),
		}
	})

	switch (variant) {
		case 'card':
			return (
				<CardChoiceGroup
					value={currentSelection}
					onChange={handleChange}
					options={choiceOptions}
					/* eslint-disable-next-line jsx-a11y/no-autofocus */
					autoFocus={autoFocus}
					defaultValue={defaultValue}
					title={title}
					aria={aria}
				/>
			)
		case 'toggle':
			return (
				<ToggleChoiceGroup
					value={currentSelection}
					onChange={handleChange}
					options={choiceOptions}
					/* eslint-disable-next-line jsx-a11y/no-autofocus */
					autoFocus={autoFocus}
					defaultValue={defaultValue}
					title={title}
					aria={aria}
				/>
			)
		case 'select':
			return (
				<SelectChoiceGroup
					value={currentSelection}
					onChange={handleChange}
					options={choiceOptions}
					/* eslint-disable-next-line jsx-a11y/no-autofocus */
					autoFocus={autoFocus}
					defaultValue={defaultValue}
					title={title}
					aria={aria}
				/>
			)
		case 'radio':
		default:
			return (
				<RadioChoiceGroup
					value={currentSelection}
					onChange={handleChange}
					options={choiceOptions}
					/* eslint-disable-next-line jsx-a11y/no-autofocus */
					autoFocus={autoFocus}
					defaultValue={defaultValue}
					aria={aria}
				/>
			)
	}
}
