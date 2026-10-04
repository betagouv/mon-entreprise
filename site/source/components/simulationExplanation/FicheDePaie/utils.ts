import Engine, {
	ASTNode,
	EvaluatedNode,
	ParsedRules,
	reduceAST,
	Rule,
	RuleNode,
	serializeEvaluation,
} from 'publicodes'

import { DottedName } from '@/domaine/publicodes/DottedName'
import { findReferenceInNode } from '@/utils/publicodes/publicodes'

export type Namespace = 'salarié' | 'assimilé salarié'

/**
 * Le modèle salarié calcule les cotisations patronales sous chaque régime
 * d'exonération, et désigne le plus avantageux. La fiche de paie affiche les
 * cotisations et l'exonération de ce régime : les cotisations sont listées
 * dans `cotisations dues`, mais leur montant se lit dans l'évaluation du
 * régime, qui les calcule à ses propres taux.
 *
 * Les modèles sans régimes portent leurs cotisations directement dans
 * `cotisations . employeur`.
 */
const régimeLePlusAvantageux = (
	engine: Engine<DottedName>,
	namespace: Namespace
): string | undefined => {
	const règle =
		`${namespace} . cotisations . employeur . régimes . le plus avantageux` as DottedName

	return règle in engine.getParsedRules()
		? (engine.evaluate(règle).nodeValue as string)
		: undefined
}

/**
 * La formule seule, sans les dépendances de la règle vers ses parents : ce
 * sont elles qui amènent les conventions collectives qui remplacent
 * `cotisations . employeur`, et qui ne sont pas des cotisations.
 */
const formuleDesCotisationsEmployeur = (
	namespace: Namespace,
	règles: ParsedRules<DottedName>
): ASTNode =>
	(
		règles[
			`${namespace} . cotisations . employeur . cotisations dues` as DottedName
		] ?? règles[`${namespace} . cotisations . employeur` as const]
	).explanation.valeur

const estLaRéférenceÉvaluée = (nœud: object, référence: string) =>
	'nodeKind' in nœud &&
	nœud.nodeKind === 'reference' &&
	'dottedName' in nœud &&
	nœud.dottedName === référence &&
	'nodeValue' in nœud

/**
 * L'occurrence évaluée la moins profonde de la référence : le montant de la
 * cotisation tel que le régime l'a calculé.
 */
const montantDansLÉvaluation = (
	évaluation: EvaluatedNode,
	référence: string
): EvaluatedNode | undefined => {
	const àVisiter: unknown[] = [évaluation]
	const visités = new Set<unknown>()

	for (let i = 0; i < àVisiter.length; i++) {
		const nœud = àVisiter[i]
		if (!nœud || typeof nœud !== 'object' || visités.has(nœud)) continue
		visités.add(nœud)

		if (estLaRéférenceÉvaluée(nœud, référence)) {
			return nœud as EvaluatedNode
		}
		for (const [clé, enfant] of Object.entries(nœud) as [string, unknown][]) {
			if (clé !== 'rawNode') {
				àVisiter.push(
					...(Array.isArray(enfant) ? (enfant as unknown[]) : [enfant])
				)
			}
		}
	}
}

export const partPatronale = (
	engine: Engine<DottedName>,
	namespace: Namespace,
	dottedName: DottedName
): EvaluatedNode => {
	const référence = findReferenceInNode(
		dottedName,
		formuleDesCotisationsEmployeur(namespace, engine.getParsedRules())
	)
	const régime = régimeLePlusAvantageux(engine, namespace)

	if (régime === undefined) {
		return engine.evaluate({ valeur: référence ?? '0', unité: '€/mois' })
	}

	if (dottedName === `${namespace} . cotisations . exonérations`) {
		return engine.evaluate({
			valeur: `${namespace} . cotisations . exonérations . employeur . régimes . ${régime}`,
			unité: '€/mois',
		})
	}

	const montant =
		référence &&
		montantDansLÉvaluation(
			engine.evaluate(
				`${namespace} . cotisations . employeur . régimes . ${régime}` as DottedName
			),
			référence
		)

	return engine.evaluate({
		valeur: (montant && serializeEvaluation(montant)) ?? '0',
		unité: '€/mois',
	})
}

export const partSalariale = (
	engine: Engine<DottedName>,
	namespace: Namespace,
	dottedName: DottedName
): EvaluatedNode =>
	engine.evaluate({
		valeur:
			findReferenceInNode(
				dottedName,
				engine.getRule(`${namespace} . cotisations . salarié` as DottedName)
			) ?? '0',
		unité: '€/mois',
	})

export function getCotisationsBySection(
	namespace: Namespace,
	parsedRules: ParsedRules<DottedName>,
	ordreDesSections: DottedName[]
): Array<[(typeof ordreDesSections)[number], DottedName[]]> {
	const findCotisations = (formule: ASTNode) =>
		reduceAST<Array<ASTNode & { nodeKind: 'reference' }>>(
			(acc, node) => {
				if (node.nodeKind === 'reference') {
					return node.dottedName?.startsWith(`${namespace} . cotisations . `) &&
						!node.dottedName.includes('$')
						? [...acc, node]
						: acc
				}
			},
			[],
			formule
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
				formuleDesCotisationsEmployeur(namespace, parsedRules)
			),
			...findCotisations(
				parsedRules[`${namespace} . cotisations . salarié` as const].explanation
					.valeur
			),
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
