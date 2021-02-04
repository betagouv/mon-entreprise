import { Evaluation } from 'publicodes/dist/types/AST/types'
import { useCallback } from 'react'
import { debounce } from '../../utils'
import { InputProps } from './RuleInput'

export default function TextInput({
	onChange,
	value,
	id,
	missing,
	autoFocus,
}: InputProps & { value: Evaluation<string> }) {
	const debouncedOnChange = useCallback(debounce(1000, onChange), [])
	return (
		<div className="step input">
			<input
				autoFocus={autoFocus}
				className="ui__"
				type="text"
				id={id}
				onChange={({ target }) => {
					debouncedOnChange(`'${target.value}'`)
				}}
				{...{
					[missing ? 'placeholder' : 'defaultValue']: (value as string) || '',
				}}
				autoComplete="off"
			/>
		</div>
	)
}
