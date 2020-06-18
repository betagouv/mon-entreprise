import { ThemeColorsContext } from 'Components/utils/colors'
import React, { useCallback, useContext } from 'react'
import { debounce } from '../../utils'

export default function TextInput({
	onChange,
	dottedName,
	value,
	defaultValue,
	autoFocus
}) {
	const debouncedOnChange = useCallback(debounce(1000, onChange), [])

	return (
		<div className="step input">
			<input
				autoFocus={autoFocus}
				className="ui__"
				type="text"
				id={'step-' + dottedName}
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
