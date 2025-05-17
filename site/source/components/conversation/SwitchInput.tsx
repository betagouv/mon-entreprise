import { Switch } from '@/design-system/switch'

interface SwitchInputProps {
	onChange?: (isSelected: boolean) => void
	defaultSelected?: boolean
	label?: string
	id?: string
	key?: string
	invertLabel?: boolean
	'aria-label'?: string
}

export const SwitchInput = ({
	onChange,
	id,
	label,
	defaultSelected,
	key,
	invertLabel,
	'aria-label': ariaLabel,
}: SwitchInputProps) => {
	return (
		<Switch
			defaultSelected={defaultSelected}
			onChange={(isSelected: boolean) => onChange?.(isSelected)}
			light
			id={id}
			key={key}
			invertLabel={invertLabel}
			aria-label={ariaLabel || label}
		>
			{label}
		</Switch>
	)
}
