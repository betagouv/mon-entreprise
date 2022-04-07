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
import styled, { keyframes } from 'styled-components'
import RuleLink from './RuleLink'
import { useEngine } from './utils/EngineContext'

export type ValueProps<Names extends string> = {
	expression: PublicodesExpression
	unit?: string
	engine?: Engine<Names>
	displayedUnit?: string
	precision?: number
	linkToRule?: boolean
	flashOnChange?: boolean
} & React.HTMLAttributes<HTMLSpanElement>

export default function Value<Names extends string>({
	expression,
	unit,
	engine,
	displayedUnit,
	flashOnChange = false,
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
	}) as string

	if (isRule && linkToRule) {
		return (
			<RuleLink dottedName={expression as DottedName}>
				<StyledValue {...props} key={value} $flashOnChange={flashOnChange}>
					{value}
				</StyledValue>
			</RuleLink>
		)
	}

	return (
		<StyledValue {...props} key={value} $flashOnChange={flashOnChange}>
			{value}
		</StyledValue>
	)
}
const flash = keyframes`

	from {
    background-color: white;
		opacity: 0.8;
  }
	
		to {
			background-color: transparent;
		}

`

const StyledValue = styled.span<{ $flashOnChange: boolean }>`
	animation: ${flash} 0.2s 1;
	will-change: background-color, opacity;
`

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
			`[ CONDITION NON-BOOLEENNE ] dans le composant Condition: expression=${JSON.stringify(
				expression,
				null,
				2
			)}`
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
	if (engine.evaluate(dottedName).nodeValue === null) {
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
	dottedName,
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
	dottedName,
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
