/* @flow */

import { findRuleByDottedName } from 'Engine/rules'
import { encodeRuleName } from 'Engine/rules.js'
import { isNil } from 'ramda'
import { createSelector } from 'reselect'
import {
	branchAnalyseSelector,
	flatRulesSelector,
	validatedSituationBranchesSelector
} from './analyseSelectors'
import type { FlatRules } from 'Types/State'
import type {
	Règle,
	RègleAvecMontant,
	RègleValeur,
	RègleAvecValeur
} from 'Types/RegleTypes'
import type { Analysis } from 'Types/Analysis'
import type { InputSelector } from 'reselect'

export const règleLocaliséeSelector: InputSelector<
	{ lang: string },
	{ rules?: FlatRules },
	(dottedName: string) => Règle
> = createSelector(
	flatRulesSelector,
	(localizedFlatRules: ?FlatRules) => (dottedName: string): Règle => {
		if (!localizedFlatRules) {
			throw new Error(
				`[LocalizedRègleSelector] Les localizedFlatRules ne doivent pas être 'undefined' ou 'null'`
			)
		}
		const localizedRule = findRuleByDottedName(localizedFlatRules, dottedName)
		if (!localizedRule) {
			throw new Error(
				`[LocalizedRègleSelector] Impossible de trouver la règle "${dottedName}" dans les flatRules. Pensez à vérifier l'orthographe et que l'écriture est bien sous forme dottedName`
			)
		}
		return {
			nom: localizedRule.titre || localizedRule.nom,
			lien: encodeRuleName(dottedName),

			id: dottedName,
			...(localizedRule.shortDescription
				? { descriptionCourte: localizedRule.shortDescription }
				: {}),
			...(localizedRule.icon ? { icône: localizedRule.icon } : {}),
			...(localizedRule.format ? { type: localizedRule.format } : {})
		}
	}
)

export const règleValeurSelector: InputSelector<
	{ lang: string },
	{ rules?: FlatRules },
	(dottedName: string) => RègleValeur
> = createSelector(
	branchAnalyseSelector,
	validatedSituationBranchesSelector,
	règleLocaliséeSelector,
	(analysis: Analysis, situation, règleLocalisée: string => Règle) => (
		dottedName: string
	): RègleValeur => {
		if (!analysis) {
			throw new Error(
				`[règleValeurSelector] L'analyse fournie ne doit pas être 'undefined' ou 'null'`
			)
		}
		const rule =
			!Array.isArray(analysis) && // It's an array if we're in a comparative simulation.
			(analysis.cache[dottedName] ||
				analysis.targets.find(target => target.dottedName === dottedName))

		if (rule == undefined) return null

		let valeur =
			rule && !isNil(rule.nodeValue)
				? rule.nodeValue
				: Array.isArray(situation)
				? situation[0][dottedName]
				: situation[dottedName]

		if (isNil(valeur)) {
			console.warn(
				`[règleValeurSelector] Impossible de trouver la valeur associée à la règle "${dottedName}". Pensez à vérifier l'orthographe et que l'écriture est bien sous forme dottedName. Vérifiez aussi qu'il ne manque pas une valeur par défaut à une règle nécessaire au calcul.`
			)
		}
		if (valeur === 'oui') {
			valeur = true
		}
		if (valeur === 'non') {
			valeur = false
		}
		if (typeof valeur === 'boolean') {
			return { type: 'boolean', valeur }
		}
		if (rule && (rule.API || rule.explanation?.API)) {
			//TODO This code is specific to the géo API
			return { type: 'string', valeur: valeur.nom }
		}
		const type =
			(rule &&
				(rule.format || (rule.explanation && rule.explanation.format))) ||
			(!Number.isNaN(valeur) && Number.isNaN(Number.parseFloat(valeur))
				? 'string'
				: 'number')

		return {
			type,
			valeur:
				type === 'string'
					? règleLocalisée(`${dottedName} . ${valeur}`).nom
					: Number.parseFloat(valeur)
		}
	}
)

export const règleAvecMontantSelector: InputSelector<
	{ lang: string },
	{ rules?: FlatRules },
	(dottedName: string) => RègleAvecMontant
> = createSelector(
	règleValeurSelector,
	règleLocaliséeSelector,
	(règleValeur, règleLocalisée) => (dottedName: string): RègleAvecMontant => {
		const valeur = règleValeur(dottedName)
		if (!valeur || valeur.type !== 'euros') {
			throw new Error(
				`[règleAvecMontantSelector] Le type de valeur de "${dottedName}" n'est pas celui d'un montant`
			)
		}
		return {
			...règleLocalisée(dottedName),
			montant: valeur.valeur
		}
	}
)
export const règleAvecValeurSelector: InputSelector<
	{ lang: string },
	{ rules?: FlatRules },
	(dottedName: string) => RègleAvecValeur
> = createSelector(
	règleValeurSelector,
	règleLocaliséeSelector,
	(règleValeur, règleLocalisée) => (dottedName: string): RègleAvecValeur =>
		// $FlowFixMe
		({
			...règleLocalisée(dottedName),
			...règleValeur(dottedName)
		})
)
