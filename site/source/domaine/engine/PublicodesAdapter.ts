import { pipe } from 'effect'
import { isNumber } from 'effect/Number'
import * as O from 'effect/Option'
import { isBoolean } from 'effect/Predicate'
import * as R from 'effect/Record'
import Engine, {
	ASTNode,
	EvaluatedNode,
	PublicodesExpression,
} from 'publicodes'

import {
	isIsoDate,
	isoDateToPublicodesDate,
	isPublicodesStandardDate,
	publicodesDateToIsoDate,
} from '@/domaine/Date'
import { MontantAdapter } from '@/domaine/engine/MontantAdapter'
import { OuiNonAdapter } from '@/domaine/engine/OuiNonAdapter'
import { isMontant, Montant } from '@/domaine/Montant'
import { isOuiNon } from '@/domaine/OuiNon'
import { isQuantité, Quantité } from '@/domaine/Quantité'

import { QuantitéAdapter } from './QuantitéAdapter'

export type Nombre = number

export type ValeurPublicodes = string | Montant | Quantité | Nombre

const decode = (node: EvaluatedNode): O.Option<ValeurPublicodes> => {
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
		if (node.unit?.numerators.includes('€')) {
			return MontantAdapter.decode(node)
		}

		if (node.unit) {
			return QuantitéAdapter.decode(node)
		} else {
			return O.some(node.nodeValue)
		}
	}

	// eslint-disable-next-line no-console
	console.warn('Incapable de décoder', node.nodeValue)

	return O.none()
}

const encode = (
	optionalValeur: O.Option<ValeurPublicodes>
): PublicodesExpression | undefined => {
	if (O.isNone(optionalValeur)) {
		return undefined
	}

	const valeur = O.getOrUndefined(optionalValeur) as ValeurPublicodes

	if (isOuiNon(valeur)) {
		return valeur
	}

	if (isMontant(valeur)) {
		return MontantAdapter.encode(optionalValeur as O.Some<Montant>)
	}

	if (isQuantité(valeur)) {
		return QuantitéAdapter.encode(optionalValeur as O.Some<Quantité>)
	}

	if (isNumber(valeur)) return valeur

	if (isIsoDate(valeur)) {
		return isoDateToPublicodesDate(valeur)
	}

	return `'${valeur}'`
}

export const PublicodesAdapter = { decode, encode }

export const decodeSuggestions = <T extends ValeurPublicodes>(
	suggestions: Record<string, ASTNode>,
	engine: Engine
): Record<string, T> =>
	pipe(
		suggestions,
		R.map((node) => pipe(engine.evaluate(node), PublicodesAdapter.decode)),
		R.filter(O.isSome),
		R.map(O.getOrThrow)
	) as Record<string, T>

/**
 * Décode l'attribut Publicodes "arrondi" qui peut :
 * - être absent
 * - valoir "oui"
 * - valoir "1 décimale"
 * - valoir "X décimales" avec X un nombre > 1
 */
export const decodeArrondi = (
	arrondiPublicodes?: string
): number | undefined => {
	if (arrondiPublicodes === 'oui') {
		return 0
	}

	const regExpMatch = arrondiPublicodes?.match(/^(\d+) décimales?$/)
	if (regExpMatch) {
		return +regExpMatch[1]
	}
}
