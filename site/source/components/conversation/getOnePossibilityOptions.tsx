import Engine, { ASTNode, reduceAST, RuleNode } from 'publicodes'

import { Choice } from '@/components/conversation/Choice'
import { DottedName } from '@/domaine/publicodes/DottedName'

export const isOnePossibility = (node: RuleNode) =>
	reduceAST<false | (ASTNode & { nodeKind: 'une possibilité' })>(
		(_, node) => {
			if (node.nodeKind === 'une possibilité') {
				return node
			}
		},
		false,
		node
	)

export const getOnePossibilityOptions = (
	engine: Engine<DottedName>,
	path: DottedName
): Choice => {
	const node = engine.getRule(path)
	if (!node) {
		throw new Error(`La règle ${path} est introuvable`)
	}
	const variant = isOnePossibility(node)
	const canGiveUp =
		variant &&
		(!variant['choix obligatoire'] || variant['choix obligatoire'] === 'non')

	return Object.assign(
		node,
		variant
			? {
					canGiveUp,
					children: (
						variant.explanation as (ASTNode & {
							nodeKind: 'reference'
						})[]
					)
						.filter((explanation) => {
							return (
								engine.evaluate(explanation).nodeValue !== null &&
								engine.evaluate({ 'est applicable': explanation.dottedName })
									.nodeValue
							)
						})
						.map(({ dottedName }) =>
							getOnePossibilityOptions(engine, dottedName as DottedName)
						),
			  }
			: null
	)
}
