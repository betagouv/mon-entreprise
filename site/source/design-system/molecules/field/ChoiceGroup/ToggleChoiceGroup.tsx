import { Key } from 'react'

import { Radio, ToggleGroup } from '../Radio'
import { ChoiceOption, isChoiceOptionWithValue } from './ChoiceOption'

export interface ToggleChoiceGroupProps {
	id?: string
	value?: string
	onChange: (value: Key) => void
	autoFocus?: boolean
	defaultValue?: string
	aria?: {
		labelledby?: string
	}
	options: ChoiceOption[]
	title?: string
}

export default function ToggleChoiceGroup({
	value,
	onChange,
	autoFocus,
	defaultValue,
	options,
	aria = {},
}: ToggleChoiceGroupProps) {
	return (
		<ToggleGroup
			aria-label=""
			aria-labelledby={aria.labelledby}
			onChange={onChange}
			value={value}
		>
			{options.map((option) =>
				isChoiceOptionWithValue(option) ? (
					<Radio
						key={option.key}
						value={option.value}
						/* eslint-disable-next-line jsx-a11y/no-autofocus */
						autoFocus={autoFocus && defaultValue === option.value}
						isDisabled={option.isDisabled}
					>
						{option.label}
					</Radio>
				) : (
					option.children.map((subOption) => (
						<Radio
							key={subOption.key}
							value={subOption.value}
							/* eslint-disable-next-line jsx-a11y/no-autofocus */
							autoFocus={autoFocus && defaultValue === subOption.value}
							isDisabled={subOption.isDisabled}
						>
							{subOption.label}
						</Radio>
					))
				)
			)}
		</ToggleGroup>
	)
}
