import {
	EvaluatedNode,
	Evaluation,
	PublicodesExpression,
	serializeEvaluation,
} from 'publicodes'
import { Key, useCallback, useEffect, useRef, useState } from 'react'

export interface SelectionInputProps {
	value: EvaluatedNode['nodeValue']
	dottedName?: string
	onChange: (value: PublicodesExpression | undefined) => void
	missing?: boolean
	onSubmit?: (source?: string) => void
	id?: string
}

export function useSelection({
	value,
	onChange,
	missing,
	dottedName,
}: SelectionInputProps) {
	const serializeValue = (nodeValue: Evaluation) =>
		serializeEvaluation({ nodeValue } as EvaluatedNode)

	const defaultValue = serializeValue(value)
	const [currentSelection, setCurrentSelection] = useState<string | null>(
		(!missing && defaultValue) || null
	)

	const debounce = useRef<NodeJS.Timeout>()
	const handleChange = useCallback(
		(val: Key) => {
			val = val.toString()
			if (!val.length) {
				return
			}
			setCurrentSelection(val)

			debounce.current != null && clearTimeout(debounce.current)
			debounce.current = setTimeout(() => {
				onChange(val)
			}, 300)
		},
		[onChange, dottedName]
	)

	const lastValue = useRef(value)
	useEffect(() => {
		if (lastValue.current !== value) {
			const newSelection = serializeValue(value)
			if (currentSelection !== newSelection) {
				setCurrentSelection(
					!missing && newSelection != null ? newSelection : null
				)
			}
			lastValue.current = value
		}
	}, [value, missing, currentSelection])

	return { currentSelection, handleChange, defaultValue }
}
