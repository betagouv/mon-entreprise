import {
	defaultNode,
	evaluateNode,
	makeJsx,
	mergeAllMissing
} from 'Engine/evaluation'
import { Node } from 'Engine/mecanismViews/common'
import { has } from 'ramda'
import React from 'react'
import { Trans } from 'react-i18next'
import { EvaluatedRule } from 'Types/rule'

type MecanismRoundProps = {
	nodeValue: EvaluatedRule['nodeValue']
	explanation: ArrondiExplanation
}

type ArrondiExplanation = {
	value: EvaluatedRule
	decimals: EvaluatedRule
}

function MecanismRound({ nodeValue, explanation }: MecanismRoundProps) {
	return (
		<Node
			classes="mecanism arrondi"
			name="arrondi"
			value={nodeValue}
			unit={explanation.value.unit}
			child={
				<>
					{makeJsx(explanation.value)}
					{explanation.decimals.isDefault !== false && (
						<p>
							<Trans i18nKey="arrondi-to-decimals">
								Arrondi à {explanation.decimals.nodeValue} décimales
							</Trans>
						</p>
					)}
				</>
			}
		/>
	)
}

function roundWithPrecision(n: number, fractionDigits: number) {
	return +n.toFixed(fractionDigits)
}

let evaluate = (
	cache,
	situation,
	parsedRules,
	node: EvaluatedRule<ArrondiExplanation>
) => {
	const evaluateAttribute = evaluateNode.bind(
		null,
		cache,
		situation,
		parsedRules
	)
	const value = evaluateAttribute(node.explanation.value)
	const decimals = evaluateAttribute(node.explanation.decimals)

	const nodeValue =
		typeof value.nodeValue === 'number'
			? roundWithPrecision(value.nodeValue, decimals.nodeValue)
			: value.nodeValue

	return {
		...node,
		unit: value.unit,
		nodeValue,
		missingVariables: mergeAllMissing([value, decimals]),
		explanation: { value, decimals }
	}
}

export default (recurse, k, v) => {
	const explanation = {
		value: has('valeur', v) ? recurse(v['valeur']) : recurse(v),
		decimals: has('décimales', v) ? recurse(v['décimales']) : defaultNode(0)
	} as ArrondiExplanation

	return {
		explanation,
		evaluate,
		// eslint-disable-next-line
		jsx: (nodeValue, explanation) => (
			<MecanismRound nodeValue={nodeValue} explanation={explanation} />
		),
		category: 'mecanism',
		name: 'arrondi',
		type: 'numeric',
		unit: explanation.value.unit
	}
}
