import { Key } from 'react'

import { RadioCard, RadioCardGroup } from '../Radio'
import { ChoiceOption, isChoiceOptionWithValue } from './ChoiceOption'

interface CardChoiceGroupProps {
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
	isSubGroup?: boolean
}

export default function CardChoiceGroup({
	value,
	onChange,
	autoFocus,
	defaultValue,
	options,
	title,
	aria = {},
	isSubGroup = false,
}: CardChoiceGroupProps) {
	return (
		<RadioCardGroup
			aria-label=""
			aria-labelledby={aria.labelledby}
			onChange={onChange}
			value={value}
			label={title}
			isSubGroup={isSubGroup}
		>
			{options.map((option) =>
				isChoiceOptionWithValue(option) ? (
					<RadioCard
						key={option.key}
						// eslint-disable-next-line jsx-a11y/no-autofocus
						autoFocus={autoFocus && defaultValue === option.value}
						value={option.value}
						label={option.label}
						emoji={option.emoji}
						description={option.description}
						isDisabled={option.isDisabled}
					/>
				) : (
					<CardChoiceGroup
						key={option.label}
						value={value}
						onChange={onChange}
						/* eslint-disable-next-line jsx-a11y/no-autofocus */
						autoFocus={autoFocus}
						defaultValue={defaultValue}
						options={option.children}
						title={option.label}
						aria={aria}
						isSubGroup={true}
					/>
				)
			)}
		</RadioCardGroup>
	)
}
