import * as R from 'ramda'
import { ParsedRules } from '../types'
import * as ASTTypes from './ASTTypes'

export type RuleDependencies<Names extends string> = Array<Names>
export type RulesDependencies<Names extends string> = Array<
	[Names, RuleDependencies<Names>]
>

export function ruleDepsOfNode<Names extends string>(
	ruleName: Names,
	node: ASTTypes.ASTNode
): RuleDependencies<Names> {
	function ruleDepsOfFormule(
		formule: ASTTypes.Formule<Names>
	): RuleDependencies<Names> {
		return ruleDepsOfNode(ruleName, formule.explanation)
	}

	function ruleDepsOfValue(value: ASTTypes.Value): RuleDependencies<Names> {
		return []
	}

	function ruleDepsOfOperation(
		operation: ASTTypes.Operation
	): RuleDependencies<Names> {
		return operation.explanation.flatMap(
			R.partial<Names, ASTTypes.ASTNode, RuleDependencies<Names>>(
				ruleDepsOfNode,
				[ruleName]
			)
		)
	}

	function ruleDepsOfPossibilities(
		possibilities: ASTTypes.Possibilities
	): RuleDependencies<Names> {
		return []
	}
	function ruleDepsOfPossibilities2(
		possibilities: ASTTypes.Possibilities2
	): RuleDependencies<Names> {
		return []
	}

	function ruleDepsOfReference(
		reference: ASTTypes.Reference<Names>
	): RuleDependencies<Names> {
		return [reference.dottedName]
	}

	function ruleDepsOfRecalculMech(
		recalculMech: ASTTypes.RecalculMech<Names>
	): RuleDependencies<Names> {
		const ruleReference = recalculMech.explanation.recalcul.partialReference
		return ruleReference === ruleName ? [] : [ruleReference]
	}

	function ruleDepsOfPlafondMech(
		encadrementMech: ASTTypes.PlafondMech
	): RuleDependencies<Names> {
		const result = [
			encadrementMech.explanation.plafond,
			encadrementMech.explanation.valeur
		].flatMap(
			R.partial<Names, ASTTypes.ASTNode, RuleDependencies<Names>>(
				ruleDepsOfNode,
				[ruleName]
			)
		)
		return result
	}

	function ruleDepsOfPlancherMech(
		mech: ASTTypes.PlancherMech
	): RuleDependencies<Names> {
		const result = [mech.explanation.plancher, mech.explanation.valeur].flatMap(
			R.partial<Names, ASTTypes.ASTNode, RuleDependencies<Names>>(
				ruleDepsOfNode,
				[ruleName]
			)
		)
		return result
	}

	function ruleDepsOfApplicableMech(
		mech: ASTTypes.ApplicableMech | ASTTypes.NonApplicableMech
	): RuleDependencies<Names> {
		const result = [
			mech.explanation.condition,
			mech.explanation.valeur
		].flatMap(
			R.partial<Names, ASTTypes.ASTNode, RuleDependencies<Names>>(
				ruleDepsOfNode,
				[ruleName]
			)
		)
		return result
	}

	function ruleDepsOfSommeMech(
		sommeMech: ASTTypes.SommeMech
	): RuleDependencies<Names> {
		const result = sommeMech.explanation.flatMap(
			R.partial<Names, ASTTypes.ASTNode, RuleDependencies<Names>>(
				ruleDepsOfNode,
				[ruleName]
			)
		)
		return result
	}

	function ruleDepsOfProduitMech(
		produitMech: ASTTypes.ProduitMech
	): RuleDependencies<Names> {
		const result = [
			produitMech.explanation.assiette,
			produitMech.explanation.plafond,
			produitMech.explanation.facteur,
			produitMech.explanation.taux
		].flatMap(
			R.partial<Names, ASTTypes.ASTNode, RuleDependencies<Names>>(
				ruleDepsOfNode,
				[ruleName]
			)
		)
		return result
	}

	function ruleDepsOfVariationsMech(
		variationsMech: ASTTypes.VariationsMech
	): RuleDependencies<Names> {
		function ruleOfVariation({
			condition,
			consequence
		}: {
			condition: ASTTypes.ASTNode
			consequence: ASTTypes.ASTNode
		}): RuleDependencies<Names> {
			return R.concat(
				ruleDepsOfNode<Names>(ruleName, condition),
				ruleDepsOfNode<Names>(ruleName, consequence)
			)
		}
		const result = variationsMech.explanation.flatMap(ruleOfVariation)
		return result
	}

	function ruleDepsOfAllegementMech(
		allegementMech: ASTTypes.AllegementMech
	): RuleDependencies<Names> {
		const subNodes = [
			allegementMech.explanation.abattement,
			allegementMech.explanation.assiette,
			allegementMech.explanation.plafond
		]
		const result = subNodes.flatMap(
			R.partial<Names, ASTTypes.ASTNode, RuleDependencies<Names>>(
				ruleDepsOfNode,
				[ruleName]
			)
		)
		return result
	}

	function ruleDepsOfBaremeMech(
		baremeMech: ASTTypes.BaremeMech
	): RuleDependencies<Names> {
		const tranchesNodes = baremeMech.explanation.tranches.flatMap(
			({ plafond, taux }) => [plafond, taux]
		)
		const result = R.concat(
			[baremeMech.explanation.assiette, baremeMech.explanation.multiplicateur],
			tranchesNodes
		).flatMap(
			R.partial<Names, ASTTypes.ASTNode, RuleDependencies<Names>>(
				ruleDepsOfNode,
				[ruleName]
			)
		)
		return result
	}

	/**
	 * Returns 0 dependency for _inversion numérique_ as it's not creating a logical dependency.
	 */
	function ruleDepsOfInversionNumMech(
		inversionNumMech: ASTTypes.InversionNumMech<Names>
	): RuleDependencies<Names> {
		return []
	}

	function ruleDepsOfArrondiMech(
		arrondiMech: ASTTypes.ArrondiMech
	): RuleDependencies<Names> {
		const result = [
			arrondiMech.explanation.arrondi,
			arrondiMech.explanation.valeur
		].flatMap(
			R.partial<Names, ASTTypes.ASTNode, RuleDependencies<Names>>(
				ruleDepsOfNode,
				[ruleName]
			)
		)
		return result
	}

	function ruleDepsOfMaxMech(
		maxMech: ASTTypes.MaxMech
	): RuleDependencies<Names> {
		const result = maxMech.explanation.flatMap(
			R.partial<Names, ASTTypes.ASTNode, RuleDependencies<Names>>(
				ruleDepsOfNode,
				[ruleName]
			)
		)
		return result
	}

	function ruleDepsOfMinMech(
		minMech: ASTTypes.MinMech
	): RuleDependencies<Names> {
		const result = minMech.explanation.flatMap(
			R.partial<Names, ASTTypes.ASTNode, RuleDependencies<Names>>(
				ruleDepsOfNode,
				[ruleName]
			)
		)
		return result
	}

	function ruleDepsOfComposantesMech(
		composantesMech: ASTTypes.ComposantesMech
	): RuleDependencies<Names> {
		const result = composantesMech.explanation.flatMap(
			R.partial<Names, ASTTypes.ASTNode, RuleDependencies<Names>>(
				ruleDepsOfNode,
				[ruleName]
			)
		)
		return result
	}

	function ruleDepsOfUneConditionsMech(
		uneConditionsMech: ASTTypes.UneConditionsMech
	): RuleDependencies<Names> {
		const result = uneConditionsMech.explanation.flatMap(
			R.partial<Names, ASTTypes.ASTNode, RuleDependencies<Names>>(
				ruleDepsOfNode,
				[ruleName]
			)
		)
		return result
	}

	function ruleDepsOfToutesConditionsMech(
		toutesConditionsMech: ASTTypes.ToutesConditionsMech
	): RuleDependencies<Names> {
		const result = toutesConditionsMech.explanation.flatMap(
			R.partial<Names, ASTTypes.ASTNode, RuleDependencies<Names>>(
				ruleDepsOfNode,
				[ruleName]
			)
		)
		return result
	}

	function ruleDepsOfSyncMech(_: ASTTypes.SyncMech): RuleDependencies<Names> {
		return []
	}

	function ruleDepsOfGrilleMech(
		grilleMech: ASTTypes.GrilleMech
	): RuleDependencies<Names> {
		const tranchesNodes = grilleMech.explanation.tranches.flatMap(
			({ montant, plafond }) => [montant, plafond]
		)
		const result = R.concat(
			[grilleMech.explanation.assiette, grilleMech.explanation.multiplicateur],
			tranchesNodes
		).flatMap(
			R.partial<Names, ASTTypes.ASTNode, RuleDependencies<Names>>(
				ruleDepsOfNode,
				[ruleName]
			)
		)
		return result
	}

	function ruleDepsOfTauxProgMech(
		tauxProgMech: ASTTypes.TauxProgMech
	): RuleDependencies<Names> {
		const tranchesNodes = tauxProgMech.explanation.tranches.flatMap(
			({ plafond, taux }) => [plafond, taux]
		)
		const result = R.concat(
			[
				tauxProgMech.explanation.assiette,
				tauxProgMech.explanation.multiplicateur
			],
			tranchesNodes
		).flatMap(
			R.partial<Names, ASTTypes.ASTNode, RuleDependencies<Names>>(
				ruleDepsOfNode,
				[ruleName]
			)
		)
		return result
	}

	function ruleDepsOfDureeMech(
		dureeMech: ASTTypes.DureeMech
	): RuleDependencies<Names> {
		const result = [
			dureeMech.explanation.depuis,
			dureeMech.explanation["jusqu'à"]
		].flatMap(
			R.partial<Names, ASTTypes.ASTNode, RuleDependencies<Names>>(
				ruleDepsOfNode,
				[ruleName]
			)
		)
		return result
	}

	let result
	if (ASTTypes.isFormule<Names>(node)) {
		result = ruleDepsOfFormule(node)
	} else if (ASTTypes.isValue(node)) {
		result = ruleDepsOfValue(node)
	} else if (ASTTypes.isOperation(node)) {
		result = ruleDepsOfOperation(node)
	} else if (ASTTypes.isReference<Names>(node)) {
		result = ruleDepsOfReference(node)
	} else if (ASTTypes.isPossibilities(node)) {
		result = ruleDepsOfPossibilities(node)
	} else if (ASTTypes.isPossibilities2(node)) {
		result = ruleDepsOfPossibilities2(node)
	} else if (ASTTypes.isRecalculMech<Names>(node)) {
		result = ruleDepsOfRecalculMech(node)
	} else if (ASTTypes.isApplicableMech(node)) {
		result = ruleDepsOfApplicableMech(node)
	} else if (ASTTypes.isNonApplicableMech(node)) {
		result = ruleDepsOfApplicableMech(node)
	} else if (ASTTypes.isPlafondMech(node)) {
		result = ruleDepsOfPlafondMech(node)
	} else if (ASTTypes.isPlancherMech(node)) {
		result = ruleDepsOfPlancherMech(node)
	} else if (ASTTypes.isSommeMech(node)) {
		result = ruleDepsOfSommeMech(node)
	} else if (ASTTypes.isProduitMech(node)) {
		result = ruleDepsOfProduitMech(node)
	} else if (ASTTypes.isVariationsMech(node)) {
		result = ruleDepsOfVariationsMech(node)
	} else if (ASTTypes.isAllegementMech(node)) {
		result = ruleDepsOfAllegementMech(node)
	} else if (ASTTypes.isBaremeMech(node)) {
		result = ruleDepsOfBaremeMech(node)
	} else if (ASTTypes.isInversionNumMech<Names>(node)) {
		result = ruleDepsOfInversionNumMech(node)
	} else if (ASTTypes.isArrondiMech(node)) {
		result = ruleDepsOfArrondiMech(node)
	} else if (ASTTypes.isMaxMech(node)) {
		result = ruleDepsOfMaxMech(node)
	} else if (ASTTypes.isMinMech(node)) {
		result = ruleDepsOfMinMech(node)
	} else if (ASTTypes.isComposantesMech(node)) {
		result = ruleDepsOfComposantesMech(node)
	} else if (ASTTypes.isUneConditionsMech(node)) {
		result = ruleDepsOfUneConditionsMech(node)
	} else if (ASTTypes.isToutesConditionsMech(node)) {
		result = ruleDepsOfToutesConditionsMech(node)
	} else if (ASTTypes.isSyncMech(node)) {
		result = ruleDepsOfSyncMech(node)
	} else if (ASTTypes.isGrilleMech(node)) {
		result = ruleDepsOfGrilleMech(node)
	} else if (ASTTypes.isTauxProgMech(node)) {
		result = ruleDepsOfTauxProgMech(node)
	} else if (ASTTypes.isDureeMech(node)) {
		result = ruleDepsOfDureeMech(node)
	}

	if (result === undefined) {
		throw new Error(
			`This node doesn't have a visitor method defined: ${node.name}`
		)
	}
	return result
}

function ruleDepsOfRuleNode<Names extends string>(
	ruleNode: ASTTypes.RuleNode<Names>
): RuleDependencies<Names> {
	return ruleNode.formule === undefined
		? []
		: ruleDepsOfNode(ruleNode.dottedName, ruleNode.formule)
}

export function buildRulesDependencies<Names extends string>(
	parsedRules: ParsedRules<Names>
): RulesDependencies<Names> {
	// This stringPairs thing is necessary because `toPairs` is strictly considering that
	// object keys are strings (same for `Object.entries`). Maybe we should build our own
	// `toPairs`?
	const stringPairs: Array<[string, ASTTypes.RuleNode<Names>]> = Object.entries(
		parsedRules
	)
	const pairs: Array<[Names, ASTTypes.RuleNode<Names>]> = stringPairs as Array<
		[Names, ASTTypes.RuleNode<Names>]
	>

	return pairs.map(
		([dottedName, ruleNode]: [Names, ASTTypes.RuleNode<Names>]): [
			Names,
			RuleDependencies<Names>
		] => [dottedName, ruleDepsOfRuleNode<Names>(ruleNode)]
	)
}
