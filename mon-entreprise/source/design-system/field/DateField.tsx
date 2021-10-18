import TextField from './TextField'
import { AriaTextFieldOptions } from '@react-aria/textfield'

export default function DateField(props: AriaTextFieldOptions) {
	return (
		<TextField
			{...props}
			css={`
				text-transform: uppercase;
			`}
			type="date"
			placeholder="JJ/MM/AAAA"
			maxLength={11}
		/>
	)
}
