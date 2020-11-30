import { isEmpty } from 'ramda'
import { EvaluatedRule } from '..'
import { ASTNode, EvaluatedNode } from '../AST/types'
import { InfixMecanism } from '../components/mecanisms/common'
import { makeJsx, mergeAllMissing } from '../evaluation'
import { registerEvaluationFunction } from '../evaluationFunctions'
import parse from '../parse'

function MecanismSituation({ explanation }) {
	return explanation.situationValeur ? (
		<InfixMecanism prefixed value={explanation.valeur} dimValue>
			<p>
				<strong>Valeur renseignée dans la simulation : </strong>
				{makeJsx(explanation.situationValeur)}
			</p>
		</InfixMecanism>
	) : (
		makeJsx(explanation.valeur)
	)
}

export type SituationNode = {
	explanation: {
		situationKey: string
		valeur: ASTNode
		situationValeur?: ASTNode
	}
	jsx: any
	nodeKind: 'nom dans la situation'
}
export default function parseSituation(v, context) {
	const explanation = {
		situationKey: v[parseSituation.nom],
		valeur: parse(v.valeur, context)
	}
	return {
		jsx: MecanismSituation,
		nodeKind: parseSituation.nom,
		explanation
	} as SituationNode
}

parseSituation.nom = 'nom dans la situation' as const

registerEvaluationFunction(parseSituation.nom, function evaluate(node) {
	const explanation = { ...node.explanation }
	const situationKey = explanation.situationKey
	let valeur: EvaluatedNode
	if (situationKey in this.parsedSituation) {
		valeur = this.evaluateNode(this.parsedSituation[situationKey])
		explanation.situationValeur = valeur
	} else {
		valeur = this.evaluateNode(explanation.valeur)
		explanation.valeur = valeur
		delete explanation.situationValeur
	}

	const unit =
		valeur.unit ??
		('unit' in explanation.valeur ? explanation.valeur.unit : undefined)
	const missingVariables = mergeAllMissing(
		[explanation.situationValeur, explanation.valeur].filter(Boolean) as Array<
			EvaluatedRule
		>
	)
	return {
		...node,
		nodeValue: valeur.nodeValue,
		missingVariables:
			isEmpty(missingVariables) && valeur.nodeValue === null
				? { [situationKey]: 1 }
				: missingVariables,
		...(unit !== undefined && { unit }),
		explanation
	}
})
