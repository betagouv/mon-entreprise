import { Key } from 'react'
import { Item } from 'react-stately'

import { Select } from '../Select'
import { ChoiceOption, isChoiceOptionWithValue } from './ChoiceOption'

export interface SelectChoiceGroupProps {
	id?: string
	value?: string
	onChange: (value: Key) => void
	autoFocus?: boolean
	defaultValue?: string
	aria?: {
		labelledby?: string
		label?: string
	}
	options: ChoiceOption[]
	title?: string
}

// TODO: gérer les sous-options correctement (avec des sections)
// lorqu'on utilisera react-aria-components plutôt que des composants maisons
export default function SelectChoiceGroup({
	value,
	onChange,
	autoFocus,
	defaultValue,
	options,
	title,
	aria = {},
}: SelectChoiceGroupProps) {
	const handleSelectionChange = (selectedKey: Key | null) => {
		if (selectedKey !== null) {
			onChange(selectedKey.toString())
		}
	}

	return (
		<Select
			aria-labelledby={aria.labelledby}
			aria-label={aria.label}
			label={title}
			onSelectionChange={handleSelectionChange}
			defaultSelectedKey={defaultValue}
			selectedKey={value}
			// eslint-disable-next-line jsx-a11y/no-autofocus
			autoFocus={autoFocus}
		>
			{options
				.map((option) =>
					isChoiceOptionWithValue(option) ? (
						<Item key={option.key} textValue={option.label}>
							{option.label}
						</Item>
					) : (
						option.children.map((subOption) => (
							<Item key={subOption.key} textValue={subOption.label}>
								{subOption.label}
							</Item>
						))
					)
				)
				.flat()}
		</Select>
	)
}
