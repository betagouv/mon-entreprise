import { DottedName } from 'modele-social'
import Engine, {
	ASTNode,
	formatValue,
	isNotApplicable,
	isNotYetDefined,
	PublicodesExpression,
} from 'publicodes'
import React from 'react'
import { useTranslation } from 'react-i18next'
import RuleLink from './RuleLink'
import { useEngine } from './utils/EngineContext'

export type ValueProps<Names extends string> = {
	expression: PublicodesExpression
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
	const defaultEngine = useEngine()
	const e = engine ?? defaultEngine
	const isRule =
		typeof expression === 'string' && expression in e.getParsedRules()
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
	expression: PublicodesExpression | ASTNode
	defaultIfNotYetDefined?: boolean
	children: React.ReactNode
}

export function Condition({
	expression,
	defaultIfNotYetDefined = false,
	children,
}: ConditionProps) {
	const engine = useEngine()
	const value = engine.evaluate(expression).nodeValue
	const boolValue = isNotYetDefined(value)
		? defaultIfNotYetDefined
		: isNotApplicable(value)
		? false
		: value

	if (Boolean(boolValue) !== boolValue) {
		console.error(
			`[ CONDITION NON-BOOLEENNE ] dans le composant Condition: expression=${expression}`
		)
	}
	if (!boolValue) {
		return null
	}

	return <>{children}</>
}

export function WhenApplicable({
	dottedName,
	children,
}: {
	dottedName: DottedName
	children: React.ReactNode
}) {
	const engine = useEngine()
	if (engine.evaluate(dottedName).nodeValue == null) {
		return null
	}

	return <>{children}</>
}
export function WhenNotApplicable({
	dottedName,
	children,
}: {
	dottedName: DottedName
	children: React.ReactNode
}) {
	const engine = useEngine()
	if (engine.evaluate(dottedName).nodeValue !== null) {
		return null
	}

	return <>{children}</>
}

export function WhenAlreadyDefined({
	dottedName: dottedName,
	children,
}: {
	dottedName: DottedName
	children: React.ReactNode
}) {
	const engine = useEngine()
	if (isNotYetDefined(engine.evaluate(dottedName).nodeValue)) {
		return null
	}

	return <>{children}</>
}

export function WhenNotAlreadyDefined({
	dottedName: dottedName,
	children,
}: {
	dottedName: DottedName
	children: React.ReactNode
}) {
	const engine = useEngine()
	if (!isNotYetDefined(engine.evaluate(dottedName).nodeValue)) {
		return null
	}

	return <>{children}</>
}
