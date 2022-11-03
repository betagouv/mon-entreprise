import { Evaluation } from 'publicodes'
import { useCallback } from 'react'
import styled from 'styled-components'

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
		<StyledTextArea
			autoFocus={autoFocus}
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
	)
}

const StyledTextArea = styled.textarea`
	width: 100%;
	font-size: 1rem;
	line-height: 1.5rem;
	padding: ${({ theme }) => theme.spacings.sm};
	border-radius: ${({ theme }) => theme.box.borderRadius};
	border: 1px solid ${({ theme }) => theme.colors.extended.grey[500]};
	font-family: ${({ theme }) => theme.fonts.main};
`
