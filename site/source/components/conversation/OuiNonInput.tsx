import { DottedName } from 'modele-social'
import { Trans, useTranslation } from 'react-i18next'

import { InputProps } from '@/components/conversation/RuleInput'
import { Radio, ToggleGroup } from '@/design-system'
import { useSelection } from '@/hooks/UseSelection'

export function OuiNonInput<Names extends string = DottedName>(
	props: InputProps<Names>
) {
	const { t } = useTranslation()

	// seront stockées ainsi dans le state :
	// [parent object path]: dotted fieldName relative to parent
	const { handleChange, defaultValue, currentSelection } = useSelection(props)

	return (
		<ToggleGroup
			aria-label={t('conversation.yes-no.aria-label', 'Oui ou non')}
			{...props}
			onChange={handleChange}
			value={currentSelection ?? undefined}
		>
			{/* eslint-disable-next-line jsx-a11y/no-autofocus */}
			<Radio
				value="oui"
				id={`input-oui-${props.id || ''}`}
				autoFocus={props.autoFocus && defaultValue === 'oui'}
			>
				<Trans>Oui</Trans>
			</Radio>
			{/* eslint-disable-next-line jsx-a11y/no-autofocus */}
			<Radio
				value="non"
				id={`input-non-${props.id || ''}`}
				autoFocus={props.autoFocus && defaultValue === 'non'}
			>
				<Trans>Non</Trans>
			</Radio>
		</ToggleGroup>
	)
}
