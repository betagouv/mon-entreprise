import { Fragment, Key } from 'react'
import { useTranslation } from 'react-i18next'

import { RadioCard, RadioCardGroup } from '@/design-system/field/Radio'

import { ChoiceOption } from './ChoiceOption'

interface CardChoiceGroupProps {
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

export default function CardChoiceGroup({
	value,
	onChange,
	autoFocus,
	defaultValue,
	options,
	title,
	aria = {},
}: CardChoiceGroupProps) {
	const { t } = useTranslation()

	return (
		<RadioCardGroup
			aria-label={
				aria.label ||
				t('conversation.multiple-answer.aria-label', 'Choix multiples')
			}
			aria-labelledby={aria.labelledby}
			onChange={onChange}
			value={value}
			label={title}
		>
			{options.map((option) => (
				<Fragment key={option.key}>
					<RadioCard
						// eslint-disable-next-line jsx-a11y/no-autofocus
						autoFocus={autoFocus && defaultValue === option.value}
						value={option.value}
						label={option.label}
						emoji={option.emoji}
						description={option.description}
						isDisabled={option.isDisabled}
					/>
				</Fragment>
			))}
		</RadioCardGroup>
	)
}
