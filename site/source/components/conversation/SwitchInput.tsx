import { Switch } from '@/design-system/switch'

export const SwitchInput = (props: {
	onChange?: (isSelected: boolean) => void
	defaultSelected?: boolean
	label?: string
	id?: string
	key?: string
	invertLabel?: boolean
}) => {
	const { onChange, id, label, defaultSelected, key, invertLabel } = props

	return (
		<Switch
			defaultSelected={defaultSelected}
			onChange={(isSelected: boolean) => onChange && onChange(isSelected)}
			light
			id={id}
			key={key}
			invertLabel={invertLabel}
			aria-label={label}
		>
			{label}
		</Switch>
	)
}
