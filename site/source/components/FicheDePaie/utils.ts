import { ASTNode, ParsedRules, reduceAST, Rule, RuleNode } from 'publicodes'

import { DottedName } from '@/domaine/publicodes/DottedName'

export type Namespace = 'salarié' | 'assimilé salarié'

export function getCotisationsBySection(
	namespace: Namespace,
	parsedRules: ParsedRules<DottedName>,
	ordreDesSections: DottedName[]
): Array<[(typeof ordreDesSections)[number], DottedName[]]> {
	const findCotisations = (dottedName: DottedName) =>
		reduceAST<Array<ASTNode & { nodeKind: 'reference' }>>(
			(acc, node) => {
				if (
					node.nodeKind === 'reference' &&
					node.dottedName !== `${namespace} . cotisations` &&
					node.dottedName?.startsWith(`${namespace} . `) &&
					!node.dottedName?.endsWith('$SITUATION')
				) {
					return [...acc, node]
				}
			},
			[],
			parsedRules[dottedName]
		)

	const getSection = (rule: RuleNode): (typeof ordreDesSections)[number] => {
		const section = `${namespace} . cotisations . catégories . ${
			(rule.rawNode as Rule & { cotisation?: { branche?: string } })?.cotisation
				?.branche ?? ''
		}` as (typeof ordreDesSections)[number]
		if (ordreDesSections.includes(section)) {
			return section
		}

		return `${namespace} . cotisations . catégories . divers`
	}

	const cotisations = (
		[
			...findCotisations(
				`${namespace} . cotisations . employeur` as DottedName
			),
			...findCotisations(`${namespace} . cotisations . salarié` as DottedName),
		] as Array<ASTNode & { dottedName: DottedName } & { nodeKind: 'reference' }>
	)
		.map((cotisation) => cotisation.dottedName)
		.filter(Boolean)
		.map(
			(dottedName) =>
				dottedName.replace(/ . (salarié|employeur)$/, '') as DottedName
		)
		.reduce(
			(acc, cotisation: DottedName) => {
				const sectionName = getSection(parsedRules[cotisation])

				return {
					...acc,
					[sectionName]: (acc[sectionName] ?? new Set()).add(cotisation),
				}
			},
			{} as Record<(typeof ordreDesSections)[number], Set<DottedName>>
		)

	return Object.entries(cotisations)
		.map(([section, dottedNames]) => [section, [...dottedNames.values()]])
		.sort(
			([a], [b]) =>
				ordreDesSections.indexOf(a as (typeof ordreDesSections)[number]) -
				ordreDesSections.indexOf(b as (typeof ordreDesSections)[number])
		) as Array<[(typeof ordreDesSections)[number], DottedName[]]>
}
