import {
	defaultNode,
	evaluateNode,
	makeJsx,
	mergeAllMissing
} from 'Engine/evaluation'
import { Node } from 'Engine/mecanismViews/common'
import { mapTemporal, pureTemporal, temporalAverage } from 'Engine/temporal'
import { EvaluatedRule } from 'Engine/types'
import { has } from 'ramda'
import React from 'react'
import { Trans } from 'react-i18next'

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
		>
			<>
				{makeJsx(explanation.value)}
				{explanation.decimals.isDefault !== false && (
					<p>
						<Trans
							i18nKey="arrondi-to-decimals"
							count={explanation.decimals.nodeValue}
						>
							Arrondi à {{ count: explanation.decimals.nodeValue }} décimales
						</Trans>
					</p>
				)}
			</>
		</Node>
	)
}

function roundWithPrecision(n: number, fractionDigits: number) {
	return +n.toFixed(fractionDigits)
}

function evaluate<Names extends string>(
	cache,
	situation,
	parsedRules,
	node: EvaluatedRule<Names, ArrondiExplanation>
) {
	const evaluateAttribute = evaluateNode.bind(
		null,
		cache,
		situation,
		parsedRules
	)
	const value = evaluateAttribute(node.explanation.value)
	const decimals = evaluateAttribute(node.explanation.decimals)

	const temporalValue = mapTemporal(
		(val: number | false | null) =>
			typeof val === 'number'
				? roundWithPrecision(val, decimals.nodeValue)
				: val,
		value.temporalValue ?? pureTemporal(value.nodeValue)
	)

	const nodeValue = temporalAverage(temporalValue, value.unit)
	return {
		...node,
		unit: value.unit,
		nodeValue,
		...(temporalValue.length > 1 && { temporalValue }),
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
