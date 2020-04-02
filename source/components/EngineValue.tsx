import { formatValue } from 'Engine/format'
import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { EngineContext } from './utils/EngineContext'
import { coerceArray } from '../utils'

export type ValueProps = {
	expression: string
	unit?: string
	displayedUnit?: string
	precision?: number
} & React.HTMLProps<HTMLSpanElement>

export default function Value({
	expression,
	unit,
	displayedUnit,
	precision,
	...props
}: ValueProps) {
	const { language } = useTranslation().i18n
	if (expression === null) {
		throw new TypeError('expression cannot be null')
	}
	const evaluation = useContext(EngineContext).evaluate(expression, { unit })
	return (
		<span {...props}>
			{formatValue({
				nodeValue: evaluation.nodeValue,
				unit:
					displayedUnit ?? ('unit' in evaluation ? evaluation.unit : undefined),
				language,
				precision
			})}
		</span>
	)
}

type ConditionProps = {
	expression: string | string[]
	children: React.ReactNode
}
export function Condition({ expression, children }: ConditionProps) {
	const engine = useContext(EngineContext)
	if (!coerceArray(expression).every(expr => engine.evaluate(expr).nodeValue)) {
		return null
	}
	return <>{children}</>
}
