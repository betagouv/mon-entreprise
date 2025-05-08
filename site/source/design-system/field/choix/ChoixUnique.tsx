import { Key, useCallback, useState } from 'react'

import {
	CardChoiceGroup,
	ChoiceDisplayType,
	ChoiceOption,
	RadioChoiceGroup,
	SelectChoiceGroup,
	ToggleChoiceGroup,
} from '@/design-system/field/ChoiceGroup'

export interface SimpleChoiceOption {
	value: string
	label: string
	description?: string
	emoji?: string
	isDefaultSelected?: boolean
}

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

	const choiceOptions: ChoiceOption[] = options.map((option) => ({
		key: option.value,
		value: option.value,
		label: option.label,
		description: option.description,
		emoji: option.emoji,
		isDefaultSelected: option.isDefaultSelected || option.value === value,
	}))

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
