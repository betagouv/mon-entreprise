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
	onSubmit?: (source?: string) => void
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
	options,
	onChange,
	onSubmit,
	title,
	autoFocus,
	variant = 'radio',
	defaultValue,
	aria,
}: ChoixUniqueProps) {
	const [currentSelection, setCurrentSelection] = useState<string | undefined>(
		value || defaultValue || undefined
	)

	const handleChange = useCallback(
		(val: Key) => {
			const stringVal = val.toString()
			if (!stringVal.length) {
				return
			}
			setCurrentSelection(stringVal)

			onChange(stringVal)

			if (onSubmit) {
				onSubmit()
			}
		},
		[onChange, onSubmit]
	)

	const choiceOptions: ChoiceOption[] = options.map((option) => ({
		key: option.value,
		value: option.value,
		label: option.label,
		description: option.description,
		emoji: option.emoji,
		isDefaultSelected:
			option.isDefaultSelected || option.value === defaultValue,
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
