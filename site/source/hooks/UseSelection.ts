import { useCallback, useEffect, useRef, useState } from 'react'

export interface SelectionProps<T> {
	value: T
	onChange: (value: T) => void
}

export function useSelection<T>({ value, onChange }: SelectionProps<T>) {
	const [currentSelection, setCurrentSelection] = useState(value)

	const lastValue = useRef(value)
	useEffect(() => {
		if (lastValue.current !== value) {
			if (currentSelection !== value) {
				setCurrentSelection(value)
			}

			lastValue.current = value
		}
	}, [value, currentSelection])

	const debounce = useRef<NodeJS.Timeout>()
	const handleChange = useCallback(
		(val: T) => {
			setCurrentSelection(val)

			debounce.current != null && clearTimeout(debounce.current)
			debounce.current = setTimeout(() => {
				onChange(val)
			}, 300)

			// TODO: cleanup needed
		},
		[onChange]
	)

	return {
		currentSelection,
		handleChange,
	}
}
