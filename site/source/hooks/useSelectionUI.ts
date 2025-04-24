import { Key, useCallback, useEffect, useRef, useState } from 'react'

interface SelectionUIProps {
	value?: string | boolean
	onChange: (value: string | undefined) => void
	defaultValue?: string
	onSubmit?: (source?: string) => void
	id?: string
}

export function useSelectionUI({
	value,
	onChange,
	defaultValue,
	onSubmit,
}: SelectionUIProps) {
	const stringValue =
		value !== undefined
			? typeof value === 'boolean'
				? value
					? 'oui'
					: 'non'
				: value.toString()
			: undefined

	const [currentSelection, setCurrentSelection] = useState<string | undefined>(
		stringValue || defaultValue
	)

	useEffect(() => {
		if (stringValue !== undefined && stringValue !== currentSelection) {
			setCurrentSelection(stringValue)
		}
	}, [stringValue])

	const debounce = useRef<NodeJS.Timeout>()
	const handleChange = useCallback(
		(val: Key) => {
			const stringVal = val.toString()
			if (!stringVal.length) {
				return
			}

			setCurrentSelection(stringVal)

			debounce.current != null && clearTimeout(debounce.current)
			debounce.current = setTimeout(() => {
				onChange(stringVal)

				if (onSubmit) {
					onSubmit()
				}
			}, 300)
		},
		[onChange, onSubmit]
	)

	return {
		currentSelection,
		handleChange,
		defaultValue: defaultValue || stringValue,
	}
}
