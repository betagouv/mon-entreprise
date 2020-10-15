/**
 * Note: all here is strictly based on duck typing.
 * We don't exepect the parent rule to explain the type of the contained formula, for example.
 */
import * as R from 'ramda'
import { ParsedRule } from '../types'
import { ArrondiExplanation } from '../mecanisms/arrondi'

export type OnOff = 'oui' | 'non'
export function isOnOff(a: string): a is OnOff {
	return a === 'oui' || a === 'non'
}

// Note: to build type-guards, we would need to have a `isNames` guard. That's
// pretty cumbersome, so for now we rely on this.
export type WannabeDottedName = string
export function isWannabeDottedName(a: string): a is WannabeDottedName {
	return typeof a === 'string'
}

export type ASTNode = { [_: string]: any | undefined }

export type RuleNode<Names extends string> = ASTNode & ParsedRule<Names>

export type RuleProp = ASTNode & {
	category: 'ruleProp'
	rulePropType: string
}
export function isRuleProp(node: ASTNode): node is RuleProp {
	return (
		(node as RuleProp).category === 'ruleProp' &&
		typeof (node as RuleProp).rulePropType === 'string'
	)
}

export type Formule<Names extends string> = RuleProp & {
	name: 'formule'
	rulePropType: 'formula'
	explanation: FormuleExplanation<Names>
}
export function isFormule<Names extends string>(
	node: ASTNode
): node is Formule<Names> {
	const formule = node as Formule<Names>
	return (
		isRuleProp(node) &&
		formule.name === 'formule' &&
		formule.rulePropType === 'formula' &&
		isFormuleExplanation<Names>(formule.explanation)
	)
}

export type FormuleExplanation<Names extends string> =
	| Value
	| Operation
	| Possibilities
	| Possibilities2
	| Reference<Names>
	| AnyMechanism<Names>
export function isFormuleExplanation<Names extends string>(
	node: ASTNode
): node is FormuleExplanation<Names> {
	return (
		isValue(node) ||
		isOperation(node) ||
		isReference(node) ||
		isPossibilities(node) ||
		isPossibilities2(node) ||
		isAnyMechanism<Names>(node)
	)
}

export type Value = ASTNode & {
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

export type Operation = ASTNode & {
	operationType: 'comparison' | 'calculation'
	explanation: Array<ASTNode>
}
export function isOperation(node: ASTNode): node is Operation {
	return R.includes((node as Operation).operationType, [
		'comparison',
		'calculation'
	])
}

export type Possibilities = ASTNode & {
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
export type Possibilities2 = ASTNode & {
	[index: number]: string // short dotted name
	'choix obligatoire'?: OnOff
	'une possibilité': OnOff
}
export function isPossibilities2(node: ASTNode): node is Possibilities2 {
	const possibilities2 = node as Possibilities2
	return (
		Object.entries(possibilities2).every(
			([k, v]) => isNaN(parseInt(k, 10)) || typeof v === 'string'
		) &&
		(possibilities2['choix obligatoire'] === undefined ||
			isOnOff(possibilities2['choix obligatoire'])) &&
		isOnOff(possibilities2['une possibilité'])
	)
}

export type Reference<Names extends string> = ASTNode & {
	category: 'reference'
}
export function isReference<Names extends string>(
	node: ASTNode
): node is Reference<Names> {
	const reference = node as Reference<Names>
	return reference.category === 'reference'
}

export type AbstractMechanism = ASTNode & {
	category: 'mecanism'
	name: string
}
export function isAbstractMechanism(node: ASTNode): node is AbstractMechanism {
	return (
		(node as AbstractMechanism).category === 'mecanism' &&
		typeof (node as AbstractMechanism).name === 'string'
	)
}

export type RecalculMech<Names extends string> = AbstractMechanism & {
	explanation: {
		recalcul: Reference<Names>
		amendedSituation: Record<Names, Reference<Names>>
	}
}
export function isRecalculMech<Names extends string>(
	node: ASTNode
): node is RecalculMech<Names> {
	const recalculMech = node as RecalculMech<Names>
	const isReferenceSpec = isReference as (
		node: ASTNode
	) => node is Reference<Names>
	return (
		typeof recalculMech.explanation === 'object' &&
		typeof recalculMech.explanation.recalcul === 'object' &&
		isReferenceSpec(recalculMech.explanation.recalcul as ASTNode) &&
		typeof recalculMech.explanation.amendedSituation === 'object'
	)
}

export type PlafondMech = AbstractMechanism & {
	name: 'plafond'
	explanation: {
		valeur: ASTNode
		plafond: ASTNode
	}
}
export function isPlafondMech(node: ASTNode): node is PlafondMech {
	const encadrementMech = node as PlafondMech
	return (
		isAbstractMechanism(encadrementMech) &&
		encadrementMech.name == 'plafond' &&
		typeof encadrementMech.explanation === 'object' &&
		encadrementMech.explanation.valeur !== undefined &&
		encadrementMech.explanation.plafond !== undefined
	)
}

export type PlancherMech = AbstractMechanism & {
	name: 'plancher'
	explanation: {
		valeur: ASTNode
		plancher: ASTNode
	}
}
export function isPlancherMech(node: ASTNode): node is PlancherMech {
	const encadrementMech = node as PlancherMech
	return (
		isAbstractMechanism(encadrementMech) &&
		encadrementMech.name == 'plancher' &&
		typeof encadrementMech.explanation === 'object' &&
		encadrementMech.explanation.valeur !== undefined &&
		encadrementMech.explanation.plancher !== undefined
	)
}

export type ApplicableMech = AbstractMechanism & {
	name: 'applicable si'
	explanation: {
		valeur: ASTNode
		condition: ASTNode
	}
}
export function isApplicableMech(node: ASTNode): node is ApplicableMech {
	const mech = node as ApplicableMech
	return (
		isAbstractMechanism(mech) &&
		mech.name == 'applicable si' &&
		typeof mech.explanation === 'object' &&
		mech.explanation.valeur !== undefined &&
		mech.explanation.condition !== undefined
	)
}

export type NonApplicableMech = AbstractMechanism & {
	name: 'non applicable si'
	explanation: {
		valeur: ASTNode
		condition: ASTNode
	}
}
export function isNonApplicableMech(node: ASTNode): node is NonApplicableMech {
	const mech = node as NonApplicableMech
	return (
		isAbstractMechanism(mech) &&
		mech.name == 'non applicable si' &&
		typeof mech.explanation === 'object' &&
		mech.explanation.valeur !== undefined &&
		mech.explanation.condition !== undefined
	)
}

export type SommeMech = AbstractMechanism & {
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

export type ProduitMech = AbstractMechanism & {
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

export type VariationsMech = AbstractMechanism & {
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

export type AllegementMech = AbstractMechanism & {
	name: 'allègement'
	explanation: {
		abattement: ASTNode
		assiette: ASTNode
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
		allegementMech.explanation.plafond !== undefined
	)
}

export type BaremeMech = AbstractMechanism & {
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

export type InversionNumMech<Names extends string> = AbstractMechanism & {
	name: 'inversion numérique'
	explanation: {
		inversionCandidates: Array<Reference<Names>>
	}
}
export function isInversionNumMech<Names extends string>(
	node: ASTNode
): node is InversionNumMech<Names> {
	const inversionNumMech = node as InversionNumMech<Names>
	const isReferenceSpec = isReference as (
		node: ASTNode
	) => node is Reference<Names>
	return (
		isAbstractMechanism(inversionNumMech) &&
		inversionNumMech.name === 'inversion numérique' &&
		typeof inversionNumMech.explanation === 'object' &&
		inversionNumMech.explanation.inversionCandidates instanceof Array &&
		inversionNumMech.explanation.inversionCandidates.every(isReferenceSpec)
	)
}

export type ArrondiMech = AbstractMechanism & {
	name: 'arrondi'
	explanation: Record<keyof ArrondiExplanation, ASTNode>
}
export function isArrondiMech(node: ASTNode): node is ArrondiMech {
	const arrondiMech = node as ArrondiMech
	return (
		isAbstractMechanism(arrondiMech) &&
		arrondiMech.name === 'arrondi' &&
		typeof arrondiMech.explanation === 'object' &&
		arrondiMech.explanation.arrondi !== undefined &&
		arrondiMech.explanation.valeur !== undefined
	)
}

export type MaxMech = AbstractMechanism & {
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

export type MinMech = AbstractMechanism & {
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

export type ComposantesMech = AbstractMechanism & {
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

export type UneConditionsMech = AbstractMechanism & {
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

export type ToutesConditionsMech = AbstractMechanism & {
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

export type SyncMech = AbstractMechanism & {
	name: 'synchronisation'
	API: any
}
export function isSyncMech(node: ASTNode): node is SyncMech {
	const syncMech = node as SyncMech
	return isAbstractMechanism(syncMech) && syncMech.name === 'synchronisation'
}

export type GrilleMech = AbstractMechanism & {
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

export type TauxProgMech = AbstractMechanism & {
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

export type DureeMech = AbstractMechanism & {
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

export type AnyMechanism<Names extends string> =
	| RecalculMech<Names>
	| PlancherMech
	| PlafondMech
	| ApplicableMech
	| NonApplicableMech
	| SommeMech
	| ProduitMech
	| VariationsMech
	| AllegementMech
	| BaremeMech
	| InversionNumMech<Names>
	| ArrondiMech
	| MaxMech
	| MinMech
	| ComposantesMech
	| UneConditionsMech
	| ToutesConditionsMech
	| SyncMech
	| GrilleMech
	| TauxProgMech
	| DureeMech
export function isAnyMechanism<Names extends string>(
	node: ASTNode
): node is AnyMechanism<Names> {
	return (
		isRecalculMech<Names>(node) ||
		isPlafondMech(node) ||
		isPlancherMech(node) ||
		isApplicableMech(node) ||
		isNonApplicableMech(node) ||
		isSommeMech(node) ||
		isProduitMech(node) ||
		isVariationsMech(node) ||
		isAllegementMech(node) ||
		isBaremeMech(node) ||
		isInversionNumMech<Names>(node) ||
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
