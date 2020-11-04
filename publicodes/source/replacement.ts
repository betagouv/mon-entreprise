import { groupBy } from 'ramda'
import { AST } from 'yaml'
import { traverseParsedRules, updateAST } from './AST'
import { ASTNode } from './AST/types'
import { InternalError, warning } from './error'
import { defaultNode } from './evaluation'
import parse from './parse'
import { Context } from './parsePublicodes'
import { RuleNode } from './rule'
import { Rule } from './rule'
import { coerceArray } from './utils'

export type ReplacementNode = {
	nodeKind: 'replacement'
	definitionRule: ASTNode & { nodeKind: 'reference' }
	replacedReference: ASTNode & { nodeKind: 'reference' }
	replacementNode: ASTNode
	whiteListedNames: Array<ASTNode & { nodeKind: 'reference' }>
	jsx: any
	blackListedNames: Array<ASTNode & { nodeKind: 'reference' }>
}

export function parseReplacements(
	replacements: Rule['remplace'],
	context: Context
): Array<ReplacementNode> {
	if (!replacements) {
		return []
	}
	return coerceArray(replacements).map(reference => {
		if (typeof reference === 'string') {
			reference = { règle: reference }
		}

		const replacedReference = parse(reference.règle, context)
		let replacementNode = parse(reference.par ?? context.dottedName, context)

		const [whiteListedNames, blackListedNames] = [
			reference.dans ?? [],
			reference['sauf dans'] ?? []
		]
			.map(dottedName => coerceArray(dottedName))
			.map(refs => refs.map(ref => parse(ref, context)))

		return {
			nodeKind: 'replacement',
			definitionRule: parse(context.dottedName, context),
			replacedReference,
			replacementNode,
			jsx: null,
			whiteListedNames,
			blackListedNames
		} as ReplacementNode
	})
}

export function parseRendNonApplicable(
	rules: Rule['rend non applicable'],
	context: Context
): Array<ReplacementNode> {
	return parseReplacements(rules, context).map(replacement => ({
		...replacement,
		replacementNode: defaultNode(false)
	}))
}

export function inlineReplacements(
	parsedRules: Record<string, RuleNode>
): Record<string, RuleNode> {
	const replacements: Record<string, Array<ReplacementNode>> = groupBy(
		(r: ReplacementNode) => {
			if (!r.replacedReference.dottedName) {
				throw new InternalError(r)
			}
			return r.replacedReference.dottedName
		},
		Object.values(parsedRules).flatMap(rule => rule.replacements)
	)
	return traverseParsedRules(
		updateAST(node => {
			if (node.nodeKind === 'replacement') {
				// We don't want to replace references in replacements...
				// Nor in ammended situation of recalcul and inversion (TODO)
				return false
			}
			if (node.nodeKind === 'reference') {
				if (!node.dottedName) {
					throw new InternalError(node)
				}
				return replace(node, replacements[node.dottedName] ?? [])
			}
		}),
		parsedRules
	) as Record<string, RuleNode>
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
				whiteListedNames.some(name =>
					node.contextDottedName.startsWith(name.dottedName as string)
				)
		)
		.filter(
			({ blackListedNames }) =>
				!blackListedNames.length ||
				blackListedNames.every(
					name => !node.contextDottedName.startsWith(name.dottedName as string)
				)
		)
		.sort((r1, r2) => {
			// Replacement with whitelist conditions have precedence over the others
			const criterion1 =
				(+!!r2.whiteListedNames.length as number) -
				+!!r1.whiteListedNames.length
			// Replacement with blacklist condition have precedence over the others
			const criterion2 =
				+!!r2.blackListedNames.length - +!!r1.blackListedNames.length
			return criterion1 || criterion2
		})

	if (applicableReplacements.length > 1) {
		warning(
			node.contextDottedName,
			`
Il existe plusieurs remplacements pour la référence '${node.dottedName}'.
Lors de l'execution, ils seront résolus dans l'odre suivant :
${applicableReplacements.map(
	replacement =>
		`\n\t- Celui définit dans la règle '${replacement.definitionRule.dottedName}'`
)}
`
		)
	}
	return applicableReplacements.reduceRight<ASTNode>(
		(replacedNode, replacement) => {
			return {
				nodeKind: 'variations',
				explanation: [
					{
						condition: replacement.definitionRule,
						consequence: replacement.replacementNode
					},
					{
						condition: defaultNode(true),
						consequence: replacedNode
					}
				]
			} as ASTNode & { nodeKind: 'variations' }
		},
		node
	)
}
