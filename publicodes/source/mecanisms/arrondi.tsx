import { has } from 'ramda'
import React from 'react'
import { Trans } from 'react-i18next'
import { InfixMecanism } from '../components/mecanisms/common'
import { defaultNode, evaluateNode, mergeAllMissing } from '../evaluation'
import { simplifyNodeUnit } from '../nodeUnits'
import { mapTemporal, pureTemporal, temporalAverage } from '../temporal'
import { EvaluatedNode, EvaluatedRule } from '../types'
import { serializeUnit } from '../units'

type MecanismRoundProps = {
	explanation: ArrondiExplanation
}

type ArrondiExplanation = {
	value: EvaluatedNode<string, number>
	decimals: EvaluatedNode<string, number>
}

function MecanismRound({ explanation }: MecanismRoundProps) {
	return (
		<InfixMecanism value={explanation.value}>
			{explanation.decimals.nodeValue !== false &&
				explanation.decimals.isDefault != false && (
					<p>
						<Trans
							i18nKey="arrondi-to-decimals"
							count={explanation.decimals.nodeValue ?? undefined}
						>
							<strong>Arrondi à : </strong>
							{{ count: explanation.decimals.nodeValue }} décimales
						</Trans>
					</p>
				)}
		</InfixMecanism>
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
	const value = simplifyNodeUnit(evaluateAttribute(node.explanation.value))
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

export default (recurse, v) => {
	const explanation = {
		value: has('valeur', v) ? recurse(v['valeur']) : recurse(v),
		decimals: has('décimales', v) ? recurse(v['décimales']) : defaultNode(0)
	} as ArrondiExplanation

	return {
		explanation,
		evaluate,
		jsx: MecanismRound,
		category: 'mecanism',
		name: 'arrondi',
		type: 'numeric',
		unit: explanation.value.unit
	}
}

export function unchainRoundMecanism(recurse, rawNode) {
	const { arrondi, ...valeur } = rawNode
	const arrondiValue = recurse(arrondi)

	if (serializeUnit(arrondiValue.unit) === 'décimales') {
		return { arrondi: { valeur, décimales: arrondiValue.nodeValue } }
	} else if (arrondiValue.nodeValue === true) {
		return { arrondi: { valeur } }
	} else {
		return valeur
	}
}
