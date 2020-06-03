import { formatValue } from 'publicodes'
import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { coerceArray } from '../utils'
import RuleLink from './RuleLink'
import { ComparaisonEngine } from './SchemeComparaison'
import { EngineContext } from './utils/EngineContext'

export type ValueProps = {
	expression: string
	unit?: string
	displayedUnit?: string
	precision?: number
	comparaisonEngines?: Array<ComparaisonEngine>
	currentComparaisonEngine?: string
	linkToRule?: boolean
} & React.HTMLProps<HTMLSpanElement>

export default function Value({
	expression,
	unit,
	displayedUnit,
	precision,
	comparaisonEngines,
	currentComparaisonEngine,
	linkToRule = true,
	...props
}: ValueProps) {
	const { language } = useTranslation().i18n
	if (expression === null) {
		throw new TypeError('expression cannot be null')
	}
	const engine =
		comparaisonEngines?.find(({ name }) => name === currentComparaisonEngine)
			?.engine ?? useContext(EngineContext)

	const evaluation = engine.evaluate(expression, { unit })
	const value = formatValue(evaluation, {
		displayedUnit,
		language,
		precision
	})
	if ('dottedName' in evaluation && linkToRule) {
		const documentationState =
			comparaisonEngines && currentComparaisonEngine
				? {
						currentComparaisonEngine,
						comparaisonSituations: comparaisonEngines.map(
							({ name, situation }) => ({ name, situation })
						)
				  }
				: {}
		return (
			<RuleLink
				documentationState={documentationState}
				dottedName={evaluation.dottedName}
			>
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
