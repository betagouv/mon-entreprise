/**
 * Note: all here is strictly based on duck typing.
 * We don't exepect the parent rule to explain the type of the contained formula, for example.
 */

import R from 'ramda'
import { ArrondiExplanation } from './mecanisms/arrondi'
import { ParsedRule, ParsedRules } from './types'

type OnOff = 'oui' | 'non'
export function isOnOff(a: string): a is OnOff {
	return a === 'oui' || a === 'non'
}

type WannabeDottedName = string
export function isWannabeDottedName(a: string): a is WannabeDottedName {
	return typeof a === 'string'
}

type ASTNode = { [_: string]: {} | undefined }

// [XXX] - Vaudrait-il mieux utiliser les DottedNames directement ici?
// A priori non car on peut imaginer cette lib comme étant indépendante des règles existantes et
// fonctionnant par ex en "mode serveur".
type RuleNode<Name extends string> = /* ASTNode & */ ParsedRule<Name>

type Value = ASTNode & {
	nodeValue: number | string | boolean
}
export function isValue(node: ASTNode): node is Value {
	const value = node as Value
	return (
		typeof value.nodeValue === 'string' ||
		typeof value.nodeValue === 'number' ||
		typeof value.nodeValue === 'boolean'
	)
}

type Operation = ASTNode & {
	operationType: 'comparison' | 'calculation'
	explanation: Array<ASTNode>
}
export function isOperation(node: ASTNode): node is Operation {
	return R.includes((node as Operation).operationType, [
		'comparison',
		'calculation'
	])
}

type Possibilities = ASTNode & {
	possibilités: Array<string>
	'choix obligatoire'?: OnOff
	'une possibilité': OnOff
}
export function isPossibilities(node: ASTNode): node is Possibilities {
	const possibilities = node as Possibilities
	return (
		possibilities.possibilités instanceof Array &&
		possibilities.possibilités.every(it => typeof it === 'string') &&
		(possibilities['choix obligatoire'] === undefined ||
			isOnOff(possibilities['choix obligatoire'])) &&
		isOnOff(possibilities['une possibilité'])
	)
}
type Possibilities2 = ASTNode & {
	[index: number]: string // short dotted name
	'choix obligatoire'?: OnOff
	'une possibilité': OnOff
}
export function isPossibilities2(node: ASTNode): node is Possibilities2 {
	const possibilities2 = node as Possibilities2
	return (
		R.all(
			([k, v]) => isNaN(parseInt(k, 10)) || typeof v === 'string',
			R.toPairs(possibilities2)
		) &&
		(possibilities2['choix obligatoire'] === undefined ||
			isOnOff(possibilities2['choix obligatoire'])) &&
		isOnOff(possibilities2['une possibilité'])
	)
}

type Reference<Name extends string> = ASTNode & {
	category: 'reference'
	name: Name
	partialReference: Name
	dottedName: Name
}
export function isReference<Name extends string>(
	node: ASTNode
): node is Reference<Name> {
	const reference = node as Reference<Name>
	return (
		reference.category === 'reference' &&
		isWannabeDottedName(reference.name) &&
		isWannabeDottedName(reference.partialReference) &&
		isWannabeDottedName(reference.dottedName)
	)
}

type Recalcul<Name extends string> = ASTNode & {
	explanation: {
		recalcul: Reference<Name>
		amendedSituation: Record<Name, Reference<Name>>
	}
}
export function isRecalcul<Name extends string>(
	node: ASTNode
): node is Recalcul<Name> {
	const recalcul = node as Recalcul<Name>
	const isReferenceSpec = isReference as (
		node: ASTNode
	) => node is Reference<Name>
	return (
		typeof recalcul.explanation === 'object' &&
		typeof recalcul.explanation.recalcul === 'object' &&
		isReferenceSpec(recalcul.explanation.recalcul as ASTNode) &&
		typeof recalcul.explanation.amendedSituation === 'object'
		// [XXX] - We would like to do
		// && R.all(isDottedName, R.keys(recalcul.explanation.amendedSituation))
		// but it seems there is no simple way to get a type's guard in Typescript
		// apart if it's built as a class. Or we could rebuild everything here with
		// passing this guard ƒ as a context everywhere along with the ASTNodes,
		// with a context monad for example. Overkill.
	)
}

type AbstractMechanism = ASTNode & {
	category: 'mecanism'
	name: string
}
export function isAbstractMechanism(node: ASTNode): node is AbstractMechanism {
	return (
		(node as AbstractMechanism).category === 'mecanism' &&
		typeof (node as AbstractMechanism).name === 'string'
	)
}

type EncadrementMech = AbstractMechanism & {
	name: 'encadrement'
	explanation: {
		valeur: ASTNode
		plafond: ASTNode
		plancher: ASTNode
	}
}
export function isEncadrementMech(node: ASTNode): node is EncadrementMech {
	const encadrementMech = node as EncadrementMech
	return (
		isAbstractMechanism(encadrementMech) &&
		encadrementMech.name == 'encadrement' &&
		typeof encadrementMech.explanation === 'object' &&
		encadrementMech.explanation.valeur !== undefined &&
		encadrementMech.explanation.plafond !== undefined &&
		encadrementMech.explanation.plancher !== undefined
	)
}

type SommeMech = AbstractMechanism & {
	name: 'somme'
	explanation: Array<ASTNode>
}
export function isSommeMech(node: ASTNode): node is SommeMech {
	const sommeMech = node as SommeMech
	return (
		isAbstractMechanism(sommeMech) &&
		sommeMech.name === 'somme' &&
		sommeMech.explanation instanceof Array
	)
}

type ProduitMech = AbstractMechanism & {
	name: 'produit'
	explanation: {
		assiette: ASTNode
		plafond: ASTNode
		facteur: ASTNode
		taux: ASTNode
	}
}
export function isProduitMech(node: ASTNode): node is ProduitMech {
	const produitMech = node as ProduitMech
	return (
		isAbstractMechanism(produitMech) &&
		produitMech.name === 'produit' &&
		typeof produitMech.explanation === 'object' &&
		typeof produitMech.explanation.assiette === 'object' &&
		typeof produitMech.explanation.plafond === 'object' &&
		typeof produitMech.explanation.facteur === 'object' &&
		typeof produitMech.explanation.taux === 'object'
	)
}

type VariationsMech = AbstractMechanism & {
	name: 'variations'
	explanation: {
		condition: ASTNode
		consequence: ASTNode
	}[]
}
export function isVariationsMech(node: ASTNode): node is VariationsMech {
	const variationsMech = node as VariationsMech
	return (
		isAbstractMechanism(variationsMech) &&
		variationsMech.name === 'variations' &&
		variationsMech.explanation instanceof Array &&
		variationsMech.explanation.every(
			variation =>
				typeof variation === 'object' &&
				variation.condition !== undefined &&
				variation.consequence !== undefined
		)
	)
}

type AllegementMech = AbstractMechanism & {
	name: 'allègement'
	explanation: {
		abattement: ASTNode
		assiette: ASTNode
		décote:
			| undefined
			| {
					plafond: ASTNode
					taux: ASTNode
			  }
		franchise: ASTNode
		plafond: ASTNode
	}
}
export function isAllegementMech(node: ASTNode): node is AllegementMech {
	const allegementMech = node as AllegementMech
	return (
		isAbstractMechanism(allegementMech) &&
		allegementMech.name === 'allègement' &&
		typeof allegementMech.explanation === 'object' &&
		allegementMech.explanation.abattement !== undefined &&
		allegementMech.explanation.assiette !== undefined &&
		allegementMech.explanation.franchise !== undefined &&
		allegementMech.explanation.plafond !== undefined &&
		(allegementMech.explanation.décote === undefined ||
			(typeof allegementMech.explanation.décote === 'object' &&
				allegementMech.explanation.décote.plafond !== undefined &&
				allegementMech.explanation.décote.taux !== undefined))
	)
}

type BaremeMech = AbstractMechanism & {
	name: 'barème'
	explanation: {
		assiette: ASTNode
		multiplicateur: ASTNode
		tranches: {
			plafond: ASTNode
			taux: ASTNode
		}[]
	}
}
export function isBaremeMech(node: ASTNode): node is BaremeMech {
	const baremeMech = node as BaremeMech
	return (
		isAbstractMechanism(baremeMech) &&
		baremeMech.name === 'barème' &&
		typeof baremeMech.explanation === 'object' &&
		baremeMech.explanation.assiette !== undefined &&
		baremeMech.explanation.multiplicateur !== undefined &&
		baremeMech.explanation.tranches instanceof Array &&
		baremeMech.explanation.tranches.every(
			tranche =>
				typeof tranche === 'object' &&
				tranche.plafond !== undefined &&
				tranche.taux !== undefined
		)
	)
}

type InversionNumMech<Name extends string> = AbstractMechanism & {
	name: 'inversion numérique'
	avec: Array<string> // Actually: short dotted name
	explanation: {
		avec: Array<Reference<Name>>
	}
}
export function isInversionNumMech<Name extends string>(
	node: ASTNode
): node is InversionNumMech<Name> {
	const inversionNumMech = node as InversionNumMech<Name>
	const isReferenceSpec = isReference as (
		node: ASTNode
	) => node is Reference<Name>
	return (
		isAbstractMechanism(inversionNumMech) &&
		inversionNumMech.name === 'inversion numérique' &&
		inversionNumMech.avec instanceof Array &&
		typeof inversionNumMech.explanation === 'object' &&
		inversionNumMech.explanation.avec instanceof Array &&
		R.all(isReferenceSpec, inversionNumMech.explanation.avec)
	)
}

type ArrondiMech = AbstractMechanism & {
	name: 'arrondi'
	explanation: ArrondiExplanation
}
export function isArrondiMech(node: ASTNode): node is ArrondiMech {
	const arrondiMech = node as ArrondiMech
	return (
		isAbstractMechanism(arrondiMech) &&
		arrondiMech.name === 'arrondi' &&
		typeof arrondiMech.explanation === 'object' &&
		arrondiMech.explanation.decimals !== undefined &&
		arrondiMech.explanation.value !== undefined
	)
}

type MaxMech = AbstractMechanism & {
	name: 'le maximum de'
	explanation: Array<ASTNode>
}
export function isMaxMech(node: ASTNode): node is MaxMech {
	const maxMech = node as MaxMech
	return (
		isAbstractMechanism(maxMech) &&
		maxMech.name === 'le maximum de' &&
		maxMech.explanation instanceof Array
	)
}

type MinMech = AbstractMechanism & {
	name: 'le minimum de'
	explanation: Array<ASTNode>
}
export function isMinMech(node: ASTNode): node is MinMech {
	const minMech = node as MinMech
	return (
		isAbstractMechanism(minMech) &&
		minMech.name === 'le minimum de' &&
		minMech.explanation instanceof Array
	)
}

type ComposantesMech = AbstractMechanism & {
	name: 'composantes'
	explanation: Array<ASTNode>
}
export function isComposantesMech(node: ASTNode): node is ComposantesMech {
	const composantesMech = node as ComposantesMech
	return (
		isAbstractMechanism(composantesMech) &&
		composantesMech.name === 'composantes' &&
		composantesMech.explanation instanceof Array
	)
}

type UneConditionsMech = AbstractMechanism & {
	name: 'une de ces conditions'
	explanation: Array<ASTNode>
}
export function isUneConditionsMech(node: ASTNode): node is UneConditionsMech {
	const uneConditionsMech = node as UneConditionsMech
	return (
		isAbstractMechanism(uneConditionsMech) &&
		uneConditionsMech.name === 'une de ces conditions' &&
		uneConditionsMech.explanation instanceof Array
	)
}

type ToutesConditionsMech = AbstractMechanism & {
	name: 'toutes ces conditions'
	explanation: Array<ASTNode>
}
export function isToutesConditionsMech(
	node: ASTNode
): node is ToutesConditionsMech {
	const toutesConditionsMech = node as ToutesConditionsMech
	return (
		isAbstractMechanism(toutesConditionsMech) &&
		toutesConditionsMech.name === 'toutes ces conditions' &&
		toutesConditionsMech.explanation instanceof Array
	)
}

type SyncMech = AbstractMechanism & {
	name: 'synchronisation'
	API: {}
}
export function isSyncMech(node: ASTNode): node is SyncMech {
	const syncMech = node as SyncMech
	return isAbstractMechanism(syncMech) && syncMech.name === 'synchronisation'
}

type GrilleMech = AbstractMechanism & {
	name: 'grille'
	explanation: {
		assiette: ASTNode
		multiplicateur: ASTNode
		tranches: {
			montant: ASTNode
			plafond: ASTNode
		}[]
	}
}
export function isGrilleMech(node: ASTNode): node is GrilleMech {
	const grilleMech = node as GrilleMech
	return (
		isAbstractMechanism(grilleMech) &&
		grilleMech.name === 'grille' &&
		typeof grilleMech.explanation === 'object' &&
		grilleMech.explanation.assiette !== undefined &&
		grilleMech.explanation.multiplicateur !== undefined &&
		grilleMech.explanation.tranches instanceof Array &&
		grilleMech.explanation.tranches.every(
			tranche =>
				typeof tranche === 'object' &&
				tranche.montant !== undefined &&
				tranche.plafond !== undefined
		)
	)
}

type TauxProgMech = AbstractMechanism & {
	name: 'taux progressif'
	explanation: {
		assiette: ASTNode
		multiplicateur: ASTNode
		tranches: {
			plafond: ASTNode
			taux: ASTNode
		}[]
	}
}
export function isTauxProgMech(node: ASTNode): node is TauxProgMech {
	const tauxProgMech = node as TauxProgMech
	return (
		isAbstractMechanism(tauxProgMech) &&
		tauxProgMech.name === 'taux progressif' &&
		typeof tauxProgMech.explanation === 'object' &&
		tauxProgMech.explanation.assiette !== undefined &&
		tauxProgMech.explanation.multiplicateur !== undefined &&
		tauxProgMech.explanation.tranches instanceof Array &&
		tauxProgMech.explanation.tranches.every(
			tranche =>
				typeof tranche === 'object' &&
				tranche.plafond !== undefined &&
				tranche.taux !== undefined
		)
	)
}

type DureeMech = AbstractMechanism & {
	name: 'Durée'
	explanation: {
		depuis: ASTNode
		"jusqu'à": ASTNode
	}
}
export function isDureeMech(node: ASTNode): node is DureeMech {
	const dureeMech = node as DureeMech
	return (
		isAbstractMechanism(dureeMech) &&
		dureeMech.name === 'Durée' &&
		typeof dureeMech.explanation === 'object' &&
		dureeMech.explanation.depuis !== undefined &&
		dureeMech.explanation["jusqu'à"] !== undefined
	)
}

type AnyMechanism = EncadrementMech | SommeMech
export function isAnyMechanism(node: ASTNode): node is AnyMechanism {
	return (
		isEncadrementMech(node) ||
		isSommeMech(node) ||
		isProduitMech(node) ||
		isVariationsMech(node) ||
		isAllegementMech(node) ||
		isBaremeMech(node) ||
		isInversionNumMech(node) ||
		isArrondiMech(node) ||
		isMaxMech(node) ||
		isMinMech(node) ||
		isComposantesMech(node) ||
		isUneConditionsMech(node) ||
		isToutesConditionsMech(node) ||
		isSyncMech(node) ||
		isGrilleMech(node) ||
		isTauxProgMech(node) ||
		isDureeMech(node)
	)
}

type FormuleNode<Name extends string> =
	| Value
	| Operation
	| Possibilities
	| Possibilities2
	| Reference<Name>
	| Recalcul<Name>
	| AnyMechanism
export function isFormuleNode<Name extends string>(
	node: ASTNode
): node is FormuleNode<Name> {
	return (
		isValue(node) ||
		isOperation(node) ||
		isReference(node) ||
		isPossibilities(node) ||
		isPossibilities2(node) ||
		isRecalcul(node) ||
		isAnyMechanism(node)
	)
}

function logVisit(depth: number, typeName: string, obj: {}): void {
	return
	let cleanRepr = obj
	if (typeof obj === 'object') {
		cleanRepr = JSON.stringify(obj, null)
	}
	console.log(' '.repeat(depth) + `visiting ${typeName} node ${cleanRepr}`)
}

export function ruleDependenciesOfNode<Name extends string>(
	depth: number,
	node: ASTNode
): Array<Name> {
	function ruleDependenciesOfValue(depth: number, value: Value): Array<Name> {
		logVisit(depth, 'value', value.nodeValue)
		return []
	}

	function ruleDependenciesOfOperation(
		depth: number,
		operation: Operation
	): Array<Name> {
		logVisit(depth, 'operation', operation.operationType)
		return R.chain(
			R.partial<number, ASTNode, Array<Name>>(ruleDependenciesOfNode, [
				depth + 1
			]),
			operation.explanation
		)
	}

	function ruleDependenciesOfPossibilities(
		depth: number,
		possibilities: Possibilities
	): Array<Name> {
		logVisit(depth, 'possibilities', possibilities.possibilités)
		return []
	}
	function ruleDependenciesOfPossibilities2(
		depth: number,
		possibilities: Possibilities2
	): Array<Name> {
		logVisit(
			depth,
			'possibilities2',
			R.filter(([k, _]) => !isNaN(parseInt(k, 10)), R.toPairs(possibilities))
		)
		return []
	}

	function ruleDependenciesOfReference(
		depth: number,
		reference: Reference<Name>
	): Array<Name> {
		logVisit(depth, 'reference', reference.dottedName)
		return [reference.dottedName]
	}

	function ruleDependenciesOfRecalcul(
		depth: number,
		recalcul: Recalcul<Name>
	): Array<Name> {
		logVisit(
			depth,
			'recalcul',
			recalcul.explanation.recalcul.partialReference as string
		)
		return [recalcul.explanation.recalcul.partialReference]
	}

	function ruleDependenciesOfEncadrementMech(
		depth: number,
		encadrementMech: EncadrementMech
	): Array<Name> {
		logVisit(depth, 'encadrement mechanism', '??')
		const result = R.chain(
			R.partial<number, ASTNode, Array<Name>>(ruleDependenciesOfNode, [
				depth + 1
			]),
			[
				encadrementMech.explanation.plafond,
				encadrementMech.explanation.plancher,
				encadrementMech.explanation.valeur
			]
		)
		return result
	}

	function ruleDependenciesOfSommeMech(
		depth: number,
		sommeMech: SommeMech
	): Array<Name> {
		logVisit(depth, 'somme mech', '??')
		const result = R.chain(
			R.partial<number, ASTNode, Array<Name>>(ruleDependenciesOfNode, [
				depth + 1
			]),
			sommeMech.explanation
		)
		return result
	}

	function ruleDependenciesOfProduitMech(
		depth: number,
		produitMech: ProduitMech
	): Array<Name> {
		logVisit(depth, 'produit mech', '??')
		const result = R.chain(
			R.partial<number, ASTNode, Array<Name>>(ruleDependenciesOfNode, [
				depth + 1
			]),
			[
				produitMech.explanation.assiette,
				produitMech.explanation.plafond,
				produitMech.explanation.facteur,
				produitMech.explanation.taux
			]
		)
		return result
	}

	function ruleDependenciesOfVariationsMech(
		depth: number,
		variationsMech: VariationsMech
	): Array<Name> {
		logVisit(depth, 'variations mech', '??')

		function ruleOfVariation({
			condition,
			consequence
		}: {
			condition: ASTNode
			consequence: ASTNode
		}): Array<Name> {
			return R.concat(
				ruleDependenciesOfNode<Name>(depth + 1, condition),
				ruleDependenciesOfNode<Name>(depth + 1, consequence)
			)
		}
		const result = R.chain(ruleOfVariation, variationsMech.explanation)
		return result
	}

	function ruleDependenciesOfAllegementMech(
		depth: number,
		allegementMech: AllegementMech
	): Array<Name> {
		logVisit(depth, 'allegement mech', '??')
		const subNodes = R.concat(
			[
				allegementMech.explanation.abattement,
				allegementMech.explanation.assiette,
				allegementMech.explanation.franchise,
				allegementMech.explanation.plafond
			],
			allegementMech.explanation.décote
				? [
						allegementMech.explanation.décote.plafond,
						allegementMech.explanation.décote.taux
				  ]
				: []
		)
		const result = R.chain(
			R.partial<number, ASTNode, Array<Name>>(ruleDependenciesOfNode, [
				depth + 1
			]),
			subNodes
		)
		return result
	}

	function ruleDependenciesOfBaremeMech(
		depth: number,
		baremeMech: BaremeMech
	): Array<Name> {
		logVisit(depth, 'barème mech', '??')
		const tranchesNodes = R.chain(
			({ plafond, taux }) => [plafond, taux],
			baremeMech.explanation.tranches
		)
		const result = R.chain(
			R.partial<number, ASTNode, Array<Name>>(ruleDependenciesOfNode, [
				depth + 1
			]),
			R.concat(
				[
					baremeMech.explanation.assiette,
					baremeMech.explanation.multiplicateur
				],
				tranchesNodes
			)
		)
		return result
	}

	/**
	 * Returns 0 dependency for _inversion numérique_ as it's not creating a logical dependency.
	 */
	function ruleDependenciesOfInversionNumMech(
		depth: number,
		inversionNumMech: InversionNumMech<Name>
	): Array<Name> {
		logVisit(depth, 'inversion numérique', inversionNumMech.avec)
		return []
	}

	function ruleDependenciesOfArrondiMech(
		depth: number,
		arrondiMech: ArrondiMech
	): Array<Name> {
		logVisit(depth, 'arrondi mech', '??')

		const result = R.chain(
			R.partial<number, ASTNode, Array<Name>>(ruleDependenciesOfNode, [
				depth + 1
			]),
			[arrondiMech.explanation.decimals, arrondiMech.explanation.value]
		)
		return result
	}

	function ruleDependenciesOfMaxMech(
		depth: number,
		maxMech: MaxMech
	): Array<Name> {
		logVisit(depth, 'max mech', '??')

		const result = R.chain(
			R.partial<number, ASTNode, Array<Name>>(ruleDependenciesOfNode, [
				depth + 1
			]),
			maxMech.explanation
		)
		return result
	}

	function ruleDependenciesOfMinMech(
		depth: number,
		minMech: MinMech
	): Array<Name> {
		logVisit(depth, 'min mech', '??')

		const result = R.chain(
			R.partial<number, ASTNode, Array<Name>>(ruleDependenciesOfNode, [
				depth + 1
			]),
			minMech.explanation
		)
		return result
	}

	function ruleDependenciesOfComposantesMech(
		depth: number,
		composantesMech: ComposantesMech
	): Array<Name> {
		logVisit(depth, 'composantes mech', '??')

		const result = R.chain(
			R.partial<number, ASTNode, Array<Name>>(ruleDependenciesOfNode, [
				depth + 1
			]),
			composantesMech.explanation
		)
		return result
	}

	function ruleDependenciesOfUneConditionsMech(
		depth: number,
		uneConditionsMech: UneConditionsMech
	): Array<Name> {
		logVisit(depth, 'une conditions mech', '??')

		const result = R.chain(
			R.partial<number, ASTNode, Array<Name>>(ruleDependenciesOfNode, [
				depth + 1
			]),
			uneConditionsMech.explanation
		)
		return result
	}

	function ruleDependenciesOfToutesConditionsMech(
		depth: number,
		toutesConditionsMech: ToutesConditionsMech
	): Array<Name> {
		logVisit(depth, 'toutes conditions mech', '??')

		const result = R.chain(
			R.partial<number, ASTNode, Array<Name>>(ruleDependenciesOfNode, [
				depth + 1
			]),
			toutesConditionsMech.explanation
		)
		return result
	}

	function ruleDependenciesOfSyncMech(depth: number, _: SyncMech): Array<Name> {
		logVisit(depth, 'sync mech', '??')
		return []
	}

	function ruleDependenciesOfGrilleMech(
		depth: number,
		grilleMech: GrilleMech
	): Array<Name> {
		logVisit(depth, 'grille mech', '??')
		const tranchesNodes = R.chain(
			({ montant, plafond }) => [montant, plafond],
			grilleMech.explanation.tranches
		)
		const result = R.chain(
			R.partial<number, ASTNode, Array<Name>>(ruleDependenciesOfNode, [
				depth + 1
			]),
			R.concat(
				[
					grilleMech.explanation.assiette,
					grilleMech.explanation.multiplicateur
				],
				tranchesNodes
			)
		)
		return result
	}

	function ruleDependenciesOfTauxProgMech(
		depth: number,
		tauxProgMech: TauxProgMech
	): Array<Name> {
		logVisit(depth, 'taux progressif mech', '??')
		const tranchesNodes = R.chain(
			({ plafond, taux }) => [plafond, taux],
			tauxProgMech.explanation.tranches
		)
		const result = R.chain(
			R.partial<number, ASTNode, Array<Name>>(ruleDependenciesOfNode, [
				depth + 1
			]),
			R.concat(
				[
					tauxProgMech.explanation.assiette,
					tauxProgMech.explanation.multiplicateur
				],
				tranchesNodes
			)
		)
		return result
	}

	function ruleDependenciesOfDureeMech(
		depth: number,
		dureeMech: DureeMech
	): Array<Name> {
		logVisit(depth, 'durée mech', '??')
		const result = R.chain(
			R.partial<number, ASTNode, Array<Name>>(ruleDependenciesOfNode, [
				depth + 1
			]),
			[dureeMech.explanation.depuis, dureeMech.explanation["jusqu'à"]]
		)
		return result
	}

	if (isValue(node)) {
		return ruleDependenciesOfValue(depth, node)
	} else if (isOperation(node)) {
		return ruleDependenciesOfOperation(depth, node)
	} else if (isReference<Name>(node)) {
		return ruleDependenciesOfReference(depth, node)
	} else if (isPossibilities(node)) {
		return ruleDependenciesOfPossibilities(depth, node)
	} else if (isPossibilities2(node)) {
		return ruleDependenciesOfPossibilities2(depth, node)
	} else if (isRecalcul<Name>(node)) {
		return ruleDependenciesOfRecalcul(depth, node)
	} else if (isEncadrementMech(node)) {
		return ruleDependenciesOfEncadrementMech(depth, node)
	} else if (isSommeMech(node)) {
		return ruleDependenciesOfSommeMech(depth, node)
	} else if (isProduitMech(node)) {
		return ruleDependenciesOfProduitMech(depth, node)
	} else if (isVariationsMech(node)) {
		return ruleDependenciesOfVariationsMech(depth, node)
	} else if (isAllegementMech(node)) {
		return ruleDependenciesOfAllegementMech(depth, node)
	} else if (isBaremeMech(node)) {
		return ruleDependenciesOfBaremeMech(depth, node)
	} else if (isInversionNumMech<Name>(node)) {
		return ruleDependenciesOfInversionNumMech(depth, node)
	} else if (isArrondiMech(node)) {
		return ruleDependenciesOfArrondiMech(depth, node)
	} else if (isMaxMech(node)) {
		return ruleDependenciesOfMaxMech(depth, node)
	} else if (isMinMech(node)) {
		return ruleDependenciesOfMinMech(depth, node)
	} else if (isComposantesMech(node)) {
		return ruleDependenciesOfComposantesMech(depth, node)
	} else if (isUneConditionsMech(node)) {
		return ruleDependenciesOfUneConditionsMech(depth, node)
	} else if (isToutesConditionsMech(node)) {
		return ruleDependenciesOfToutesConditionsMech(depth, node)
	} else if (isSyncMech(node)) {
		return ruleDependenciesOfSyncMech(depth, node)
	} else if (isGrilleMech(node)) {
		return ruleDependenciesOfGrilleMech(depth, node)
	} else if (isTauxProgMech(node)) {
		return ruleDependenciesOfTauxProgMech(depth, node)
	} else if (isDureeMech(node)) {
		return ruleDependenciesOfDureeMech(depth, node)
	}

	if (node.avec) {
		// [XXX] - How come we meet this? Souldn't `mecanismRecalcul` (in `mecanisms.js`) build a `Recalcul` type node?
		console.error(
			`Visited a non-parsed recalcul node, to investigate: règle ${node.règle}`
		)
	} else {
		debugger
		throw new Error(
			`This node doesn't have a visitor method defined: ${JSON.stringify(
				node,
				null,
				4
			)}`
		)
	}
	return []
}

function ruleDependenciesOfRule<Name extends string>(
	depth: number,
	rule: RuleNode<Name>
): Array<Name> {
	logVisit(depth, 'rule', rule.dottedName as string)
	if (rule.formule) {
		const formuleNode: FormuleNode<Name> = rule.formule.explanation
		// // This is for comfort, as the responsibility over structure isn't owned by this piece of code:
		// if (!isFormuleNode(formuleNode)) {
		// 	debugger
		// 	// throw Error(
		// 	// 	`This rule's formule is not of a known type: ${rule.dottedName}`
		// 	// )
		// }
		return ruleDependenciesOfNode(depth + 1, formuleNode)
	}
	return []
}

export function buildRulesDependencies<Name extends string>(
	parsedRules: ParsedRules<Name>
): Array<[Name, Array<Name>]> {
	// This stringPairs thing is necessary because `toPairs` is strictly considering that
	// object keys are strings (same for `Object.entries`). Maybe we should build our own
	// `toPairs`?
	const stringPairs: Array<[string, RuleNode<Name>]> = R.toPairs(parsedRules)
	const pairs: Array<[Name, RuleNode<Name>]> = stringPairs as Array<
		[Name, RuleNode<Name>]
	>
	// const pairsResults: Array<Array<Name>> = R.map(
	// 	([_, ruleNode]: [Name, RuleNode<Name>]): Array<Name> =>
	// 		ruleDependenciesOfRule<Name>(0, ruleNode),
	// 	pairs
	// )

	return R.map(
		([dottedName, ruleNode]: [Name, RuleNode<Name>]): [Name, Array<Name>] => [
			dottedName,
			ruleDependenciesOfRule<Name>(0, ruleNode)
		],
		pairs
	)
}
