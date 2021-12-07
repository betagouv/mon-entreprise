import { TextField } from 'DesignSystem/field'
import { Evaluation } from 'publicodes'
import { useCallback } from 'react'
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
			autoFocus={autoFocus}
			type="text"
			label={title}
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
