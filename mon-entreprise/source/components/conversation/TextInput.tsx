import { useCallback } from 'react'
import { debounce } from '../../utils'
import { InputCommonProps } from './RuleInput'

export default function TextInput({
	onChange,
	value,
	id,
	defaultValue,
	autoFocus
}: InputCommonProps) {
	const debouncedOnChange = useCallback(debounce(1000, onChange), [])

	return (
		<div className="step input">
			<input
				autoFocus={autoFocus}
				className="ui__"
				type="text"
				id={id}
				placeholder={defaultValue?.nodeValue ?? defaultValue}
				onChange={({ target }) => {
					debouncedOnChange(`'${target.value}'`)
				}}
				defaultValue={value}
				autoComplete="off"
			/>
		</div>
	)
}
