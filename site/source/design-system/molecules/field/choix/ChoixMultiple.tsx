import { Fragment } from 'react'

import { Emoji } from '../../../emoji'
import { InfoButton } from '../../../InfoButton'
import { Checkbox } from '../Checkbox'
import { normalizeRuleName } from '@/components/utils/normalizeRuleName'

export interface ChoixOption {
	id: string
	value: boolean
	label: string
	description?: string
	emoji?: string
}

export interface ChoixMultipleProps {
	options: ChoixOption[]
	onChange: (id: string, isSelected: boolean) => void
	id?: string
	title?: string
	description?: string
	autoFocus?: boolean

	aria?: {
		labelledby?: string
	}
}

/**
 * Composant de choix multiples (cases à cocher)
 * Version UI pure découplée de Publicodes
 */
export function ChoixMultiple({
	options,
	onChange,
	aria = {},
	id,
}: ChoixMultipleProps) {
	return (
		<div
			aria-labelledby={aria.labelledby || 'questionHeader'} // FIXME: supprimer ce aria-labelledby en dur
			id={id}
		>
			{options.map((option) => (
				<Fragment key={option.id}>
					<CheckBoxOption
						option={option}
						onChange={(isSelected) => onChange(option.id, isSelected)}
					/>
				</Fragment>
			))}
		</div>
	)
}

type CheckBoxOptionProps = {
	option: ChoixOption
	onChange: (isSelected: boolean) => void
}

function CheckBoxOption({ option, onChange }: CheckBoxOptionProps) {
	return (
		<>
			<Checkbox
				defaultSelected={option.value}
				id={`checkbox-input-${normalizeRuleName(option.id)}`}
				label={option.label}
				onChange={onChange}
			/>
			{option.emoji && <Emoji emoji={option.emoji} />}{' '}
			{option.description && (
				<InfoButton
					light
					title={option.label}
					description={option.description}
				/>
			)}
			<br />
		</>
	)
}
