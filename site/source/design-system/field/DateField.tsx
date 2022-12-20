import { AriaTextFieldOptions } from '@react-aria/textfield'

import TextField from './TextField'

export default function DateField(
	props: AriaTextFieldOptions<'input'> & { isLight?: boolean }
) {
	return (
		<TextField
			{...props}
			css={`
				text-transform: uppercase;
			`}
			type="date"
		/>
	)
}
