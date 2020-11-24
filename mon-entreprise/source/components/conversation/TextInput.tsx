import { useCallback } from 'react'
import { debounce } from '../../utils'
import { InputCommonProps } from './RuleInput'

export default function TextInput({
	onChange,
	value,
	id,
	missing,
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
				placeholder={missing && value}
				onChange={({ target }) => {
					debouncedOnChange(`'${target.value}'`)
				}}
				defaultValue={!missing && value}
				autoComplete="off"
			/>
		</div>
	)
}
