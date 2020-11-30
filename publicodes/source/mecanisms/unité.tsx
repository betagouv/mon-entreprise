import { ASTNode, Unit } from '../AST/types'
import { InfixMecanism } from '../components/mecanisms/common'
import { typeWarning } from '../error'
import { makeJsx } from '../evaluation'
import { registerEvaluationFunction } from '../evaluationFunctions'
import { formatValue } from '../format'
import parse from '../parse'
import { convertUnit, parseUnit, serializeUnit } from '../units'

export type UnitéNode = {
	unit: Unit
	explanation: ASTNode
	jsx: any
	nodeKind: 'unité'
}
function MecanismUnité(node) {
	return node.explanation.nodeKind === 'constant' ||
		node.explanation.nodeKind === 'reference' ? (
		<>
			{makeJsx(node.explanation)}&nbsp;{serializeUnit(node.unit)}
		</>
	) : (
		<>
			<InfixMecanism value={node.explanation}>
				<p>
					<strong>Unité : </strong>
					{serializeUnit(node.unit)}
				</p>
			</InfixMecanism>
		</>
	)
}

export default function parseUnité(v, context): UnitéNode {
	const explanation = parse(v.valeur, context)
	const unit = parseUnit(v.unité)

	return {
		jsx: MecanismUnité,
		explanation,
		unit,
		nodeKind: parseUnité.nom
	}
}

parseUnité.nom = 'unité' as const

registerEvaluationFunction(parseUnité.nom, function evaluate(node) {
	const valeur = this.evaluateNode(node.explanation)

	let nodeValue = valeur.nodeValue
	if (nodeValue !== false && 'unit' in node) {
		try {
			nodeValue = convertUnit(
				valeur.unit,
				node.unit,
				valeur.nodeValue as number
			)
		} catch (e) {
			typeWarning(
				this.cache._meta.contextRule,
				'Erreur lors de la conversion d\'unité explicite',
				e
			)
		}
	}

	return {
		...node,
		nodeValue,
		explanation: valeur,
		missingVariables: valeur.missingVariables
	}
})
