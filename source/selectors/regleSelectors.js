/* @flow */

import { findRuleByDottedName } from 'Engine/rules'
import { encodeRuleName } from 'Engine/rules.js'
import { createSelector } from 'reselect'
import {
	analysisWithDefaultsSelector,
	flatRulesSelector
} from './analyseSelectors'
import type { FlatRules } from 'Types/State'
import type {
	Règle,
	RègleAvecMontant,
	RègleValeur,
	RègleAvecValeur
} from 'Types/RegleTypes'
import type { Analysis } from 'Types/Analysis'

export const règleLocaliséeSelector = createSelector(
	flatRulesSelector,
	(localizedFlatRules: FlatRules) => (dottedName: string): Règle => {
		if (!localizedFlatRules) {
			throw new Error(
				`[LocalizedRègleSelector] Les localizedFlatRules ne doivent pas être 'undefined' ou 'null'`
			)
		}
		const localizedRule = findRuleByDottedName(localizedFlatRules, dottedName)
		if (!localizedFlatRules) {
			throw new Error(
				`[LocalizedRègleSelector] Impossible de trouver la règle "${dottedName}" dans les flatRules. Pensez à vérifier l'orthographe et que l'écriture est bien sous forme dottedName`
			)
		}
		return {
			nom: localizedRule.titre || localizedRule.nom,
			lien: './règle/' + encodeRuleName(dottedName)
		}
	}
)

export const règleValeurSelector = createSelector(
	analysisWithDefaultsSelector,
	règleLocaliséeSelector,
	(analysis: Analysis, règleLocalisée: string => Règle) => (
		dottedName: string
	): RègleValeur => {
		if (!analysis) {
			throw new Error(
				`[règleValeurSelector] L'analyse fournie ne doit pas être 'undefined' ou 'null'`
			)
		}
		const rule =
			analysis.cache[dottedName] ||
			analysis.targets.find(target => target.dottedName === dottedName)
		if (!rule) {
			console.log(dottedName, analysis.cache[dottedName], analysis)
			throw new Error(
				`[règleValeurSelector] Impossible de trouver la règle "${dottedName}" dans l'analyse. Pensez à vérifier l'orthographe et que l'écriture est bien sous forme dottedName`
			)
		}

		const valeur = rule.nodeValue
		if (typeof valeur === 'boolean') {
			return { type: 'boolean', valeur }
		}
		const type =
			rule.format ||
			(rule.explanation && rule.explanation.format) ||
			(Number.isNaN(Number.parseFloat(rule.node)) ? 'string' : 'number')
		// $FlowFixMe
		return {
			valeur:
				type !== 'string'
					? Number.parseFloat(valeur)
					: règleLocalisée(`${dottedName} . ${valeur}`).nom,
			type
		}
	}
)

export const règleAvecMontantSelector = createSelector(
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
export const règleAvecValeurSelector = createSelector(
	règleValeurSelector,
	règleLocaliséeSelector,
	(règleValeur, règleLocalisée) => (dottedName: string): RègleAvecValeur =>
		// $FlowFixMe
		({
			...règleLocalisée(dottedName),
			...règleValeur(dottedName)
		})
)
