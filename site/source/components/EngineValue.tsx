import { useWorkerEngine } from '@publicodes/worker-react'
import { DottedName } from 'modele-social'
import {
	ASTNode,
	EvaluatedNode,
	formatValue,
	PublicodesExpression,
	RuleNode,
} from 'publicodes'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { keyframes, styled } from 'styled-components'

import { usePromise } from '@/hooks/usePromise'

import RuleLink from './RuleLink'

// import { useEngine } from './utils/EngineContext'

export type ValueProps<Names extends string> = {
	expression: PublicodesExpression
	unit?: string
	// engine?: Engine<Names>
	engineId?: number
	displayedUnit?: string
	precision?: number
	documentationPath?: string
	linkToRule?: boolean
	flashOnChange?: boolean
} & React.HTMLAttributes<HTMLSpanElement>

export default function Value<Names extends string>({
	expression,
	unit,
	engineId = 0,
	displayedUnit,
	flashOnChange = false,
	precision,
	documentationPath,
	linkToRule = true,
	...props
}: ValueProps<Names>) {
	const { language } = useTranslation().i18n
	const workerEngine = useWorkerEngine()
	if (expression === null) {
		throw new TypeError('expression cannot be null')
	}
	const parsedRules = workerEngine.getParsedRules()

	const isRule =
		typeof expression === 'string' && parsedRules && expression in parsedRules

	const evaluation = usePromise(
		() =>
			workerEngine.asyncEvaluate({
				valeur: expression,
				...(unit && { unité: unit }),
			}),
		[expression, unit, workerEngine]
	)

	const value = formatValue(evaluation, {
		displayedUnit,
		language,
		precision,
	}) as string

	const ruleEvaluation = usePromise(
		async () => isRule && linkToRule && workerEngine.asyncEvaluate(expression),
		[expression, isRule, linkToRule, workerEngine]
	)

	if (isRule && linkToRule && ruleEvaluation) {
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
	// engine?: Engine<DottedName>
	engineId?: number
}

export function Condition({
	expression,
	children,
	// engine: engineFromProps,
	engineId = 0,
}: ConditionProps) {
	// const defaultEngine = useEngine()
	// const engine = engineFromProps ?? defaultEngine
	// const nodeValue = engine.evaluate({ '!=': [expression, 'non'] }).nodeValue

	// if (!nodeValue) {
	// 	return null
	// }

	// return <>{children}</>

	const workerEngine = useWorkerEngine()

	const node = usePromise(
		() => workerEngine.asyncEvaluate({ '!=': [expression, 'non'] }),
		[expression, workerEngine]
	)

	return !node?.nodeValue ? null : <>{children}</>
}

export function WhenValueEquals({
	expression,
	value,
	children,
	// engine: engineFromProps,
	engineId = 0,
}: ConditionProps & { value: string | number }) {
	// const defaultEngine = useEngine()
	// const engine = engineFromProps ?? defaultEngine
	// const nodeValue = engine.evaluate(expression).nodeValue

	// if (nodeValue !== value) {
	// 	return null
	// }

	// return <>{children}</>
	const workerEngine = useWorkerEngine()

	const node = usePromise(
		() => workerEngine.asyncEvaluate(expression),
		[expression, workerEngine]
	)

	return node?.nodeValue !== value ? null : <>{children}</>
}

export function WhenApplicable({
	dottedName,
	children,
	engineId = 0,
}: {
	dottedName: DottedName
	children: React.ReactNode
	// engine?: Engine<DottedName>
	engineId?: number
}) {
	const workerEngine = useWorkerEngine()
	// const defaultEngine = useEngine()

	// const engineValue = engine ?? defaultEngine

	// if (
	// 	engineValue.evaluate({ 'est applicable': dottedName }).nodeValue !== true
	// ) {
	// 	return null
	// }

	// return <>{children}</>

	const node = usePromise(
		() => workerEngine.asyncEvaluate({ 'est applicable': dottedName }),
		[dottedName, workerEngine]
	)

	return node?.nodeValue !== true ? <>{children}</> : null
}

export function WhenNotApplicable({
	dottedName,
	children,
	engineId = 0,
}: {
	dottedName: DottedName
	children: React.ReactNode
	// engine?: Engine<DottedName>
	engineId?: number
}) {
	// const defaultEngine = useEngine()

	// const engineValue = engine ?? defaultEngine

	// if (
	// 	engineValue.evaluate({ 'est non applicable': dottedName }).nodeValue !==
	// 	true
	// ) {
	// 	return null
	// }

	// return <>{children}</>
	const workerEngine = useWorkerEngine()

	const node = usePromise(
		() => workerEngine.asyncEvaluate({ 'est non applicable': dottedName }),
		[dottedName, workerEngine]
	)

	return node?.nodeValue !== true ? null : <>{children}</>
}

export function WhenAlreadyDefined({
	dottedName,
	children,
	engineId = 0,
}: {
	dottedName: DottedName
	children: React.ReactNode
	// engine?: Engine<DottedName>
	engineId?: number
}) {
	const workerEngine = useWorkerEngine()
	const node = usePromise(
		() => workerEngine.asyncEvaluate({ 'est non défini': dottedName }),
		[dottedName, workerEngine]
	)

	return node?.nodeValue ? null : <>{children}</>
}

export function WhenNotAlreadyDefined({
	dottedName,
	children,
	engineId = 0,
}: {
	dottedName: DottedName
	children: React.ReactNode
	engineId?: number
}) {
	const workerEngine = useWorkerEngine()
	const node = usePromise(
		() => workerEngine.asyncEvaluate({ 'est défini': dottedName }),
		[dottedName, workerEngine]
	)

	return node?.nodeValue ? null : <>{children}</>
}
