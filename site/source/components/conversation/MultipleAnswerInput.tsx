import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'

import { Choice } from '@/components/conversation/Choice'
import { RadioChoices } from '@/components/conversation/RadioChoices'
import { InputProps } from '@/components/conversation/RuleInput'
import {
	Item,
	RadioCard,
	RadioCardGroup,
	RadioGroup,
	ToggleGroup,
} from '@/design-system'
import { Select } from '@/design-system/field/Select'
import { relativeDottedName } from '@/domaine/relativeDottedName'
import { useSelection } from '@/hooks/UseSelection'

export function MultipleAnswerInput({
	choices,
	type = 'radio',
	autoFocus,
	title,
	...props
}: {
	choices: Choice
	type?: 'radio' | 'card' | 'toggle' | 'select'
} & InputProps) {
	const { t } = useTranslation()

	// seront stockées ainsi dans le state :
	// [parent object path]: dotted fieldName relative to parent
	const { handleChange, defaultValue, currentSelection } = useSelection(props)

	if (type === 'select') {
		return (
			<Select
				aria-labelledby={props['aria-labelledby'] || undefined}
				label={title}
				onSelectionChange={handleChange}
				defaultSelectedKey={defaultValue}
				selectedKey={currentSelection}
				// eslint-disable-next-line jsx-a11y/no-autofocus
				autoFocus={autoFocus}
			>
				{choices.children.map((node) => (
					<Item
						key={`'${relativeDottedName(props.dottedName, node.dottedName)}'`}
						textValue={node.title}
					>
						{node.title}
					</Item>
				))}
			</Select>
		)
	}
	if (type === 'card') {
		return (
			<RadioCardGroup
				aria-label={t(
					'conversation.multiple-answer.aria-label',
					'Choix multiples'
				)}
				onChange={handleChange}
				value={currentSelection ?? undefined}
			>
				{choices.children.map((node) => (
					<Fragment key={node.dottedName}>
						<RadioCard
							// eslint-disable-next-line jsx-a11y/no-autofocus
							autoFocus={
								autoFocus &&
								defaultValue ===
									`'${relativeDottedName(props.dottedName, node.dottedName)}'`
							}
							aria-labelledby={props['aria-labelledby'] || undefined}
							value={`'${relativeDottedName(
								props.dottedName,
								node.dottedName
							)}'`}
							label={node.title}
							emoji={node.rawNode.icônes}
							description={node.rawNode.description}
						/>
					</Fragment>
				))}
			</RadioCardGroup>
		)
	}

	const Component = type === 'radio' ? RadioGroup : ToggleGroup

	return (
		<Component
			aria-label={t(
				'conversation.multiple-answer.aria-label',
				'Choix multiples'
			)}
			{...props}
			onChange={handleChange}
			value={currentSelection ?? undefined}
			aria-labelledby={props['aria-labelledby'] || undefined}
			isRequired={props.required}
		>
			<RadioChoices
				// eslint-disable-next-line jsx-a11y/no-autofocus
				autoFocus={autoFocus}
				defaultValue={defaultValue}
				choices={choices}
				rootDottedName={props.dottedName}
				type={type}
			/>
		</Component>
	)
}
