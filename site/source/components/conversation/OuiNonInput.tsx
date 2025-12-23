import { useTranslation } from 'react-i18next'

import { Radio, ToggleGroup } from '@/design-system'
import { OuiNon } from '@/domaine/OuiNon'
import { useSelection } from '@/hooks/UseSelection'
import { NoOp } from '@/utils/NoOp'

interface OuiNonInputProps {
	value?: OuiNon
	onChange?: (value: OuiNon | undefined) => void
	defaultValue?: OuiNon
	id?: string
	autoFocus?: boolean

	aria?: {
		labelledby?: string
	}
}

export function OuiNonInput({
	value,
	onChange = NoOp,
	defaultValue,
	id,
	autoFocus,
	aria = {},
}: OuiNonInputProps) {
	const { handleChange, currentSelection } = useSelection({
		value,
		onChange,
	})

	const handleToggleGroupChange = (value: string | undefined) => {
		handleChange(value as OuiNon | undefined)
	}
	const currentValueAsString =
		currentSelection === undefined
			? undefined
			: currentSelection === 'oui'
			? 'oui'
			: 'non'

	const { t } = useTranslation()

	return (
		<ToggleGroup
			aria-label=""
			aria-labelledby={aria.labelledby}
			onChange={handleToggleGroupChange}
			value={currentValueAsString}
		>
			<Radio
				value="oui"
				id={`input-oui-${id || ''}`}
				/* eslint-disable-next-line jsx-a11y/no-autofocus */
				autoFocus={autoFocus && defaultValue === 'oui'}
			>
				{t('conversation.yes', 'Oui')}
			</Radio>
			<Radio
				value="non"
				id={`input-non-${id || ''}`}
				/* eslint-disable-next-line jsx-a11y/no-autofocus */
				autoFocus={autoFocus && defaultValue === 'non'}
			>
				{t('conversation.no', 'Non')}
			</Radio>
		</ToggleGroup>
	)
}
