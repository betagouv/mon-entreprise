import { Evaluation } from 'publicodes'
import { useCallback } from 'react'

import { TextField } from '@/design-system/field'

import { debounce } from '../../utils'
import { InputProps } from './RuleInput'

export default function TextInput({
	onChange,
	value,
	description,
	title,
	missing,
	autoFocus,
}: InputProps & { value: Evaluation<string> }) {
	const debouncedOnChange = useCallback(debounce(1000, onChange), [])

	return (
		<TextField
			type="text"
			label={title}
			// eslint-disable-next-line jsx-a11y/no-autofocus
			autoFocus={autoFocus}
			onChange={(value) => {
				debouncedOnChange(`'${value}'`)
			}}
			description={description}
			{...{
				[missing ? 'placeholder' : 'defaultValue']: (value as string) || '',
			}}
			autoComplete="off"
		/>
	)
}
