import { DottedName } from 'modele-social'
import { EvaluatedNode, Evaluation, serializeEvaluation } from 'publicodes'
import { Key, useCallback, useEffect, useRef, useState } from 'react'

import { InputProps } from '@/components/conversation/RuleInput'

export function useSelection<Names extends string = DottedName>({
	value,
	onChange,
	missing,
}: InputProps<Names>) {
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
		[onChange]
	)

	const lastValue = useRef(value)
	useEffect(() => {
		if (lastValue.current !== value) {
			const newSelection = serializeValue(value)
			if (currentSelection !== newSelection) {
				setCurrentSelection(
					!missing && newSelection != null && typeof newSelection === 'string'
						? newSelection
						: null
				)
			}
			lastValue.current = value
		}
	}, [value, missing, currentSelection])

	return { currentSelection, handleChange, defaultValue }
}
