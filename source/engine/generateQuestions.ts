import {
	add,
	countBy,
	descend,
	flatten,
	head,
	identity,
	keys,
	map,
	mergeWith,
	pair,
	reduce,
	sortWith,
	toPairs,
	values
} from 'ramda'
import { DottedName } from 'Types/rule'

/*
	COLLECTE DES VARIABLES MANQUANTES
	*********************************
	on collecte les variables manquantes : celles qui sont nécessaires pour
	remplir les objectifs de la simulation (calculer des cotisations) mais qui n'ont pas
	encore été renseignées

	TODO perf : peut-on le faire en même temps que l'on traverse l'AST ?
	Oui sûrement, cette liste se complète en remontant l'arbre. En fait, on le fait déjà pour nodeValue,
	et quand nodeValue vaut null, c'est qu'il y a des missingVariables ! Il suffit donc de remplacer les
	null par un tableau, et d'ailleurs utiliser des fonction d'aide pour mutualiser ces tests.

	missingVariables: {variable: [objectives]}
 */

type Explanation = {
	missingVariables: Array<DottedName>
	dottedName: DottedName
}

export let getNextSteps = missingVariablesByTarget => {
	let byCount = ([, [count]]) => count
	let byScore = ([, [, score]]) => score

	let missingByTotalScore = reduce(
		mergeWith(add),
		{},
		values(missingVariablesByTarget)
	)

	let innerKeys = flatten(map(keys, values(missingVariablesByTarget))),
		missingByTargetsAdvanced = countBy(identity, innerKeys)

	let missingByCompound = mergeWith(
			pair,
			missingByTargetsAdvanced,
			missingByTotalScore
		),
		pairs = toPairs(missingByCompound),
		sortedPairs = sortWith([descend(byCount), descend(byScore) as any], pairs)
	return map(head, sortedPairs)
}
