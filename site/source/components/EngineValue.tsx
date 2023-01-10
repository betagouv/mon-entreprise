import { DottedName } from 'modele-social'
import Engine, {
	ASTNode,
	EvaluatedNode,
	PublicodesExpression,
	RuleNode,
	formatValue,
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
	documentationPath?: string
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
	documentationPath,
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
		const ruleEvaluation = e.evaluate(expression)
		let dottedName = expression as DottedName
		if (ruleEvaluation.sourceMap?.mecanismName === 'replacement') {
			dottedName =
				((
					ruleEvaluation as {
						explanation: Array<{
							condition: EvaluatedNode
							consequence: RuleNode
						}>
					}
				).explanation
					// eslint-disable-next-line eqeqeq
					.find(({ condition }) => !!condition.nodeValue)?.consequence
					.dottedName as DottedName) ?? dottedName
		}

		return (
			<RuleLink dottedName={dottedName} documentationPath={documentationPath}>
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
	children: React.ReactNode
	engine?: Engine<DottedName>
}

export function Condition({
	expression,
	children,
	engine: engineFromProps,
}: ConditionProps) {
	const defaultEngine = useEngine()
	const engine = engineFromProps ?? defaultEngine
	const nodeValue = engine.evaluate({ '!=': [expression, 'non'] }).nodeValue

	if (!nodeValue) {
		return null
	}

	return <>{children}</>
}

export function WhenValueEquals({
	expression,
	value,
	children,
	engine: engineFromProps,
}: ConditionProps & { value: string | number }) {
	const defaultEngine = useEngine()
	const engine = engineFromProps ?? defaultEngine
	const nodeValue = engine.evaluate(expression).nodeValue

	if (nodeValue !== value) {
		return null
	}

	return <>{children}</>
}

export function WhenApplicable({
	dottedName,
	children,
	engine,
}: {
	dottedName: DottedName
	children: React.ReactNode
	engine?: Engine<DottedName>
}) {
	const defaultEngine = useEngine()

	const engineValue = engine ?? defaultEngine

	if (
		engineValue.evaluate({ 'est applicable': dottedName }).nodeValue !== true
	) {
		return null
	}

	return <>{children}</>
}

export function WhenNotApplicable({
	dottedName,
	children,
	engine,
}: {
	dottedName: DottedName
	children: React.ReactNode
	engine?: Engine<DottedName>
}) {
	const defaultEngine = useEngine()

	const engineValue = engine ?? defaultEngine

	if (
		engineValue.evaluate({ 'est non applicable': dottedName }).nodeValue !==
		true
	) {
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
	if (engine.evaluate({ 'est non défini': dottedName }).nodeValue) {
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
	if (engine.evaluate({ 'est défini': dottedName }).nodeValue) {
		return null
	}

	return <>{children}</>
}
