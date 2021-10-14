import { Evaluation } from 'publicodes/dist/types/AST/types'
import { useCallback } from 'react'
import { debounce } from '../../utils'
import { InputProps } from './RuleInput'
import { TextField } from 'DesignSystem/field'

export default function TextInput({
	onChange,
	value,
	id,
	title,
	missing,
	autoFocus,
}: InputProps & { value: Evaluation<string> }) {
	const debouncedOnChange = useCallback(debounce(1000, onChange), [])
	return (
		<TextField
			autoFocus={autoFocus}
			type="text"
			id={id}
			label={title}
			onChange={({ target }) => {
				debouncedOnChange(`'${target.value}'`)
			}}
			{...{
				[missing ? 'placeholder' : 'defaultValue']: (value as string) || '',
			}}
			autoComplete="off"
		/>
	)
}
