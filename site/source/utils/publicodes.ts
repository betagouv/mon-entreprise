import Engine, {
	ASTNode,
	isPublicodesError,
	PublicodesExpression,
	reduceAST,
	Rule,
	RuleNode,
} from 'publicodes'

import { DottedName } from '@/domaine/publicodes/DottedName'
import { SituationPublicodes } from '@/store/reducers/rootReducer'

import { getValueFrom } from '.'

const isMeta = <T>(rule: Rule): rule is Rule & { meta?: T } => 'meta' in rule

/**
 * Return typed meta property from a rule
 * @param rule
 * @param defaultValue
 * @returns
 */
export const getMeta = <T>(rule: Rule, defaultValue: T) =>
	(isMeta<T>(rule) ? getValueFrom(rule, 'meta') : null) ?? defaultValue

export function evaluateQuestion(
	engine: Engine,
	rule: RuleNode
): string | undefined {
	const question = rule.rawNode.question as Exclude<
		number,
		PublicodesExpression
	>
	if (question && typeof question === 'object') {
		return engine.evaluate(question as PublicodesExpression).nodeValue as string
	}

	return question
}

export function buildSituationFromObject<Names extends string = DottedName>(
	contextDottedName: Names,
	situationObject: Record<string, PublicodesExpression>
): SituationPublicodes {
	return Object.fromEntries(
		Object.entries(situationObject).map(
			([key, value]: [string, PublicodesExpression]) => [
				`${contextDottedName} . ${key}` as Names,
				typeof value === 'string' ? `'${value}'` : value,
			]
		)
	)
}

export const catchDivideByZeroError = <T>(func: () => T) => {
	try {
		return func()
	} catch (err) {
		if (
			isPublicodesError(err, 'EvaluationError') &&
			err.message === 'Division by zero'
		) {
			// eslint-disable-next-line no-console
			console.error(err)
		}
		throw err
	}
}

export function findReferenceInNode(
	dottedName: DottedName,
	node: ASTNode
): string | undefined {
	return reduceAST<string | undefined>(
		(acc, node) => {
			if (
				node.nodeKind === 'reference' &&
				node.dottedName?.startsWith(dottedName) &&
				!node.dottedName.endsWith('$SITUATION')
			) {
				return node.dottedName
			} else if (node.nodeKind === 'reference') {
				return acc
			}
		},
		undefined,
		node
	)
}
