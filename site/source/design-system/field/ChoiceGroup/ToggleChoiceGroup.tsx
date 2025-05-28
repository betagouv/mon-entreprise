import { Fragment, Key } from 'react'
import { useTranslation } from 'react-i18next'

import { Radio, ToggleGroup } from '@/design-system/field/Radio'

import { ChoiceOption } from './ChoiceOption'

export interface ToggleChoiceGroupProps {
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

export default function ToggleChoiceGroup({
	value,
	onChange,
	autoFocus,
	defaultValue,
	options,
	aria = {},
}: ToggleChoiceGroupProps) {
	const { t } = useTranslation()

	return (
		<ToggleGroup
			aria-label={
				aria.label ||
				t('conversation.multiple-answer.aria-label', 'Choix multiples')
			}
			aria-labelledby={aria.labelledby}
			onChange={onChange}
			value={value}
		>
			{options.map((option) => (
				<Fragment key={option.key}>
					<Radio
						value={option.value}
						/* eslint-disable-next-line jsx-a11y/no-autofocus */
						autoFocus={autoFocus && defaultValue === option.value}
						isDisabled={option.isDisabled}
					>
						{option.label}
					</Radio>
				</Fragment>
			))}
		</ToggleGroup>
	)
}
