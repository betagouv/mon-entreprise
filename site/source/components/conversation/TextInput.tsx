import { ASTNode, EvaluatedNode, PublicodesExpression } from 'publicodes'
import { useCallback } from 'react'

import { TextField } from '@/design-system/field'
import { debounce } from '@/utils'

interface TextInputProps {
	value: EvaluatedNode['nodeValue']
	onChange: (value: PublicodesExpression | undefined) => void
	missing?: boolean
	title?: string
	description?: string
	autoFocus?: boolean
	onSubmit?: (source?: string) => void
	suggestions?: Record<string, ASTNode>

	aria?: {
		labelledby?: string
		label?: string
	}
}

export default function TextInput({
	onChange,
	value,
	description,
	title,
	missing,
	autoFocus,
	aria = {},
}: TextInputProps) {
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
			aria-label={aria.label ?? title}
			aria-labelledby={aria.labelledby}
		/>
	)
}
