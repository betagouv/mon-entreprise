import Engine, { formatValue } from 'publicodes'
import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { DottedName } from 'modele-social'
import { coerceArray } from '../utils'
import RuleLink from './RuleLink'
import { EngineContext, useEngine } from './utils/EngineContext'

export type ValueProps<Names extends string> = {
	expression: string
	unit?: string
	engine?: Engine<Names>
	displayedUnit?: string
	precision?: number
	linkToRule?: boolean
} & React.HTMLProps<HTMLSpanElement>

export default function Value<Names extends string>({
	expression,
	unit,
	engine,
	displayedUnit,
	precision,
	linkToRule = true,
	...props
}: ValueProps<Names>) {
	const { language } = useTranslation().i18n
	if (expression === null) {
		throw new TypeError('expression cannot be null')
	}
	const e = engine ?? useEngine()
	const isRule = expression in e.getParsedRules()
	const evaluation = e.evaluate({
		valeur: expression,
		...(unit && { unité: unit }),
	})
	const value = formatValue(evaluation, {
		displayedUnit,
		language,
		precision,
	})
	if (isRule && linkToRule) {
		return (
			<RuleLink dottedName={expression as DottedName}>
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
	if (
		!coerceArray(expression).every((expr) => engine.evaluate(expr).nodeValue)
	) {
		return null
	}
	return <>{children}</>
}
