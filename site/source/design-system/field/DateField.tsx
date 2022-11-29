import { AriaTextFieldOptions } from '@react-aria/textfield'

import TextField from './TextField'

export default function DateField(props: AriaTextFieldOptions<'input'>) {
	return (
		<TextField
			{...props}
			css={`
				text-transform: uppercase;
			`}
			type="date"
			label={undefined}
		/>
	)
}
