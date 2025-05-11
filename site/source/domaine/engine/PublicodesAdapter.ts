import { isNumber } from 'effect/Number'
import * as O from 'effect/Option'
import { isBoolean } from 'effect/Predicate'
import { DottedName } from 'modele-social'
import { EvaluatedNode } from 'publicodes'

import {
	isIsoDate,
	isoDateToPublicodesDate,
	isPublicodesStandardDate,
	publicodesDateToIsoDate,
} from '@/domaine/Date'
import { MontantAdapter } from '@/domaine/engine/MontantAdapter'
import { OuiNonAdapter } from '@/domaine/engine/OuiNonAdapter'
import { SimplePublicodesExpression } from '@/domaine/engine/SimpleRuleEvaluation'
import { isMontant, Montant, toString } from '@/domaine/Montant'
import { isOuiNon } from '@/domaine/OuiNon'

export type Nombre = number

export type ValeurPublicodes = string | Montant | Nombre

const decode = (
	node: EvaluatedNode,
	// Décodage spécial selon la règle ?
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	_règle?: DottedName
): O.Option<ValeurPublicodes> => {
	if (node.nodeValue === null || node.nodeValue === undefined) {
		return O.none()
	}

	if (isBoolean(node.nodeValue)) {
		return OuiNonAdapter.decode(node.nodeValue)
	}

	if (typeof node.nodeValue === 'string') {
		if (isPublicodesStandardDate(node.nodeValue)) {
			const date = publicodesDateToIsoDate(node.nodeValue)

			return O.some(date)
		}

		const match = node.nodeValue.match(/'(.*)'/)
		if (match?.length) {
			return O.some(match[1])
		}

		return O.some(node.nodeValue)
	}

	if (typeof node.nodeValue === 'number') {
		if (node.unit) {
			return MontantAdapter.decode(node)
		} else {
			return O.some(node.nodeValue)
		}
	}

	console.warn('Incapable de décoder', node.nodeValue)

	return O.none()
}

const encode = (
	optionalValeur: O.Option<ValeurPublicodes>,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	règle?: DottedName
): SimplePublicodesExpression => {
	if (O.isNone(optionalValeur)) {
		return undefined
	}

	const valeur = O.getOrUndefined(optionalValeur) as ValeurPublicodes

	if (isOuiNon(valeur)) {
		return valeur
	}

	if (isMontant(valeur)) {
		return toString(valeur)
	}

	if (isNumber(valeur)) return valeur

	if (isIsoDate(valeur)) {
		return isoDateToPublicodesDate(valeur)
	}

	return `'${valeur}'`
}

export const PublicodesAdapter = { decode, encode }
