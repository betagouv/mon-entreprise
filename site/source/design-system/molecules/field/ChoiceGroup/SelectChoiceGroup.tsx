import { Key } from 'react'
import { Item } from 'react-stately'

import { Select } from '../Select'
import { ChoiceOption } from './ChoiceOption'

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

export default function SelectChoiceGroup({
	value,
	onChange,
	autoFocus,
	defaultValue,
	options,
	title,
	aria = {},
}: SelectChoiceGroupProps) {
	return (
		<Select
			aria-labelledby={aria.labelledby}
			aria-label={aria.label}
			label={title}
			onSelectionChange={onChange}
			defaultSelectedKey={defaultValue}
			selectedKey={value}
			// eslint-disable-next-line jsx-a11y/no-autofocus
			autoFocus={autoFocus}
		>
			{options.map((option) => (
				<Item key={option.key} textValue={option.label}>
					{option.label}
				</Item>
			))}
		</Select>
	)
}
