import { useCallback } from 'react'
import { debounce } from '../../utils'
import { InputCommonProps } from './RuleInput'

export default function ParagrapheInput({
	onChange,
	value,
	id,
	defaultValue,
	autoFocus
}: InputCommonProps) {
	const debouncedOnChange = useCallback(debounce(1000, onChange), [])

	return (
		<div className="step input">
			<textarea
				autoFocus={autoFocus}
				className="ui__"
				rows={6}
				style={{ resize: 'none' }}
				id={id}
				placeholder={(defaultValue?.nodeValue ?? defaultValue)?.replace(
					'\\n',
					'\n'
				)}
				onChange={({ target }) => {
					debouncedOnChange(`'${target.value.replace(/\n/g, '\\n')}'`)
				}}
				defaultValue={value?.replace('\\n', '\n')}
				autoComplete="off"
			/>
		</div>
	)
}
