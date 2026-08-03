import { Switch } from '@/design-system'
import { fromOuiNon, OuiNon, toOuiNon } from '@/domaine/OuiNon'
import { NoOp } from '@/utils/NoOp'

interface OuiNonSwitchProps {
	label: string
	value?: OuiNon
	onChange?: (value: OuiNon) => void
	defaultValue?: OuiNon
}

export function OuiNonSwitch({
	label,
	onChange = NoOp,
	defaultValue,
}: OuiNonSwitchProps) {
	const handleChange = (value: boolean) => {
		onChange(toOuiNon(value))
	}

	return (
		<Switch
			onChange={handleChange}
			defaultSelected={fromOuiNon(defaultValue)}
			light
			/* Need this useless aria-label to silence a React-Aria warning */
			aria-label=""
		>
			{label}
		</Switch>
	)
}
