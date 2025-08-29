import { Switch } from '@/design-system'
import { OuiNon } from '@/domaine/OuiNon'
import { NoOp } from '@/utils/NoOp'

interface OuiNonSwitchProps {
	label: string
	value?: OuiNon
	onChange?: (value: OuiNon | undefined) => void
	defaultValue?: OuiNon
}

export function OuiNonSwitch({
	label,
	onChange = NoOp,
	defaultValue,
}: OuiNonSwitchProps) {
	const handleChange = (value: boolean) => {
		onChange(value ? 'oui' : 'non')
	}

	return (
		<Switch
			onChange={handleChange}
			defaultSelected={defaultValue === 'oui'}
			light
			/* Need this useless aria-label to silence a React-Aria warning */
			aria-label=""
		>
			{label}
		</Switch>
	)
}
