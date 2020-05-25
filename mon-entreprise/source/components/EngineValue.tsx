import Engine, { EvaluatedNode, formatValue } from 'publicodes'
import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { DottedName } from 'Rules'
import { coerceArray } from '../utils'
import RuleLink from './RuleLink'
import { EngineContext } from './utils/EngineContext'

export type ValueProps = {
	expression: string
	unit?: string
	displayedUnit?: string
	precision?: number
	engine?: Engine<DottedName>
	linkToRule?: boolean
} & React.HTMLProps<HTMLSpanElement>

export default function Value({
	expression,
	unit,
	displayedUnit,
	precision,
	engine,
	linkToRule = true,
	...props
}: ValueProps) {
	const { language } = useTranslation().i18n
	if (expression === null) {
		throw new TypeError('expression cannot be null')
	}
	const evaluation = (engine ?? useContext(EngineContext)).evaluate(
		expression,
		{ unit }
	)
	const value = formatValue(evaluation, {
		displayedUnit,
		language,
		precision
	})
	if ('dottedName' in evaluation && linkToRule) {
		return (
			<RuleLink dottedName={evaluation.dottedName}>
				<span {...props}>{value}</span>
			</RuleLink>
		)
	}
	return <span {...props}>{value}</span>
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
