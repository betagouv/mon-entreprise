import { useTranslation } from 'react-i18next'

import { Radio, ToggleGroup } from '@/design-system'
import { useSelectionUI } from '@/hooks/useSelectionUI'

interface OuiNonInputProps {
	value?: string | boolean
	onChange: (value: string | undefined) => void
	defaultValue?: string
	onSubmit?: (source?: string) => void
	id?: string
	title?: string
	description?: string
	autoFocus?: boolean

	aria?: {
		labelledby?: string
		label?: string
	}
}

export function OuiNonInput({
	value,
	onChange,
	defaultValue,
	onSubmit,
	id,
	autoFocus,
	aria = {},
}: OuiNonInputProps) {
	const { handleChange, defaultValue: derivedDefaultValue, currentSelection } = useSelectionUI({
		value,
		onChange,
		defaultValue,
		onSubmit,
		id,
	})

	const { t } = useTranslation()

	return (
		<ToggleGroup
			aria-label={
				aria.label || t('conversation.yes-no.aria-label', 'Oui ou non')
			}
			aria-labelledby={aria.labelledby}
			onChange={handleChange}
			value={currentSelection ?? undefined}
		>
			<Radio
				value="oui"
				id={`input-oui-${id || ''}`}
				/* eslint-disable-next-line jsx-a11y/no-autofocus */
				autoFocus={autoFocus && derivedDefaultValue === 'oui'}
			>
				{t('conversation.yes', 'Oui')}
			</Radio>
			<Radio
				value="non"
				id={`input-non-${id || ''}`}
				/* eslint-disable-next-line jsx-a11y/no-autofocus */
				autoFocus={autoFocus && derivedDefaultValue === 'non'}
			>
				{t('conversation.no', 'Non')}
			</Radio>
		</ToggleGroup>
	)
}
