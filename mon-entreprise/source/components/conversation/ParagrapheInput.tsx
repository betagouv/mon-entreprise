import { Evaluation } from 'publicodes/dist/types/AST/types'
import { useCallback } from 'react'
import { debounce } from '../../utils'
import { InputProps } from './RuleInput'

export default function ParagrapheInput({
	onChange,
	value,
	id,
	missing,
	autoFocus,
}: InputProps & { value: Evaluation<string> }) {
	const debouncedOnChange = useCallback(debounce(1000, onChange), [])

	return (
		<div className="step input">
			<textarea
				autoFocus={autoFocus}
				className="ui__"
				rows={6}
				style={{ resize: 'none' }}
				id={id}
				onChange={({ target }) => {
					debouncedOnChange(`'${target.value.replace(/\n/g, '\\n')}'`)
				}}
				{...{
					[missing ? 'placeholder' : 'defaultValue']: (
						(value as string) || ''
					).replace('\\n', '\n'),
				}}
				autoComplete="off"
			/>
		</div>
	)
}
