import { groupBy } from 'ramda'
import { updateAST } from './AST'
import { ASTNode } from './AST/types'
import { InternalError, warning } from './error'
import { defaultNode, makeJsx } from './evaluation'
import { VariationNode } from './mecanisms/variations'
import parse from './parse'
import { Context } from './parsePublicodes'
import { Rule, RuleNode } from './rule'
import { coerceArray } from './utils'

export type ReplacementNode = {
	nodeKind: 'replacement'
	definitionRule: ASTNode & { nodeKind: 'reference' }
	replacedReference: ASTNode & { nodeKind: 'reference' }
	replacementNode: ASTNode
	whiteListedNames: Array<ASTNode & { nodeKind: 'reference' }>
	jsx: any
	rawNode: any
	blackListedNames: Array<ASTNode & { nodeKind: 'reference' }>
}

export function parseReplacements(
	replacements: Rule['remplace'],
	context: Context
): Array<ReplacementNode> {
	if (!replacements) {
		return []
	}
	return coerceArray(replacements).map((replacement) => {
		if (typeof replacement === 'string') {
			replacement = { règle: replacement }
		}

		const replacedReference = parse(replacement.règle, context)
		const replacementNode = parse(
			replacement.par ?? context.dottedName,
			context
		)

		const [whiteListedNames, blackListedNames] = [
			replacement.dans ?? [],
			replacement['sauf dans'] ?? [],
		]
			.map((dottedName) => coerceArray(dottedName))
			.map((refs) => refs.map((ref) => parse(ref, context)))

		return {
			nodeKind: 'replacement',
			rawNode: replacement,
			definitionRule: parse(context.dottedName, context),
			replacedReference,
			replacementNode,
			jsx: (node: ReplacementNode) => (
				<span>
					Remplace {makeJsx(node.replacedReference)}{' '}
					{node.rawNode.par && <>par {makeJsx(node.replacementNode)}</>}
					{node.rawNode.dans && (
						<>dans {node.whiteListedNames.map(makeJsx).join(', ')}</>
					)}
					{node.rawNode['sauf dans'] && (
						<>sauf dans {node.blackListedNames.map(makeJsx).join(', ')}</>
					)}
				</span>
			),
			whiteListedNames,
			blackListedNames,
		} as ReplacementNode
	})
}

export function parseRendNonApplicable(
	rules: Rule['rend non applicable'],
	context: Context
): Array<ReplacementNode> {
	return parseReplacements(rules, context).map(
		(replacement) =>
			({
				...replacement,
				replacementNode: defaultNode(false),
			} as ReplacementNode)
	)
}

export function getReplacements(
	parsedRules: Record<string, RuleNode>
): Record<string, Array<ReplacementNode>> {
	return groupBy(
		(r: ReplacementNode) => {
			if (!r.replacedReference.dottedName) {
				throw new InternalError(r)
			}
			return r.replacedReference.dottedName
		},
		Object.values(parsedRules).flatMap((rule) => rule.replacements)
	)
}

export function inlineReplacements(
	replacements: Record<string, Array<ReplacementNode>>
): (n: ASTNode) => ASTNode {
	return updateAST((n, fn) => {
		if (
			n.nodeKind === 'replacement' ||
			n.nodeKind === 'inversion' ||
			n.nodeKind === 'une possibilité'
		) {
			return false
		}
		if (n.nodeKind === 'recalcul') {
			// We don't replace references in recalcul keys
			return {
				...n,
				explanation: {
					recalcul: fn(n.explanation.recalcul),
					amendedSituation: n.explanation.amendedSituation.map(
						([name, value]) => [name, fn(value)]
					),
				},
			}
		}
		if (n.nodeKind === 'reference') {
			if (!n.dottedName) {
				throw new InternalError(n)
			}
			return replace(n, replacements[n.dottedName] ?? [])
		}
	})
}

function replace(
	node: ASTNode & { nodeKind: 'reference' }, //& { dottedName: string },
	replacements: Array<ReplacementNode>
): ASTNode {
	// TODO : handle transitivité

	const applicableReplacements = replacements
		.filter(
			({ definitionRule }) =>
				definitionRule.dottedName !== node.contextDottedName
		)
		.filter(
			({ whiteListedNames }) =>
				!whiteListedNames.length ||
				whiteListedNames.some((name) =>
					node.contextDottedName.startsWith(name.dottedName as string)
				)
		)
		.filter(
			({ blackListedNames }) =>
				!blackListedNames.length ||
				blackListedNames.every(
					(name) =>
						!node.contextDottedName.startsWith(name.dottedName as string)
				)
		)
		.sort((r1, r2) => {
			// Replacement with whitelist conditions have precedence over the others
			const criterion1 =
				+!!r2.whiteListedNames.length - +!!r1.whiteListedNames.length
			// Replacement with blacklist condition have precedence over the others
			const criterion2 =
				+!!r2.blackListedNames.length - +!!r1.blackListedNames.length
			return criterion1 || criterion2
		})
	if (!applicableReplacements.length) {
		return node
	}
	if (applicableReplacements.length > 1) {
		warning(
			node.contextDottedName,
			`
Il existe plusieurs remplacements pour la référence '${node.dottedName}'.
Lors de l'execution, ils seront résolus dans l'odre suivant :
${applicableReplacements.map(
	(replacement) =>
		`\n\t- Celui définit dans la règle '${replacement.definitionRule.dottedName}'`
)}
`
		)
	}

	return {
		nodeKind: 'variations',
		rawNode: node.rawNode,
		jsx: Replacement,
		explanation: [
			...applicableReplacements.map((replacement) => ({
				condition: replacement.definitionRule,
				consequence: replacement.replacementNode,
			})),
			{
				condition: defaultNode(true),
				consequence: node,
			},
		],
	}
}

function Replacement(node: VariationNode) {
	const applicableReplacement = node.explanation.find((ex) => ex.satisfied)
		?.consequence
	const replacedNode = node.explanation.slice(-1)[0].consequence
	return makeJsx(applicableReplacement || replacedNode)
}
