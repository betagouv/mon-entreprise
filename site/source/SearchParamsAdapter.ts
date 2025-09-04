import { isMontant, montant, Montant } from '@/domaine/Montant'
import { isQuantité, Quantité, quantité } from '@/domaine/Quantité'

import { isUnitéMonétaire, isUnitéQuantité } from './domaine/Unités'

export type ValeurDomaine = string | Montant | Quantité | number

/**
 * Adapter pour transformer les valeurs du domaine en strings pour les URL params
 * et inversement.
 */
export const SearchParamsAdapter = {
	encode: (valeur: ValeurDomaine): string => {
		if (isMontant(valeur)) {
			return `${valeur.valeur}${valeur.unité}`
		}

		if (isQuantité(valeur)) {
			return `${valeur.valeur}${valeur.unité}`
		}

		if (typeof valeur === 'number') {
			return valeur.toString()
		}

		if (typeof valeur === 'string') {
			return valeur
		}

		throw new Error(`Type de valeur non supporté: ${typeof valeur}`)
	},

	/**
	 * Decode une string d'URL param en valeur du domaine typée
	 */
	decode: (valeur: string): ValeurDomaine => {
		const montantRegex = /^([0-9]+(?:[.,][0-9]+)?)\s*(€(?:\/[a-z-]+)?)$/
		const montantMatch = valeur.match(montantRegex)
		if (montantMatch) {
			const [, numberStr, unité] = montantMatch
			const nombre = parseFloat(numberStr.replace(',', '.'))

			if (!isNaN(nombre) && isUnitéMonétaire(unité)) {
				return montant(nombre, unité)
			}
		}

		const quantitéRegex = /^([0-9]+(?:[.,][0-9]+)?)\s?((?:\S+\s?)+)$/
		const quantitéMatch = valeur.match(quantitéRegex)
		if (quantitéMatch) {
			const [, numberStr, unité] = quantitéMatch
			const nombre = parseFloat(numberStr.replace(',', '.'))

			if (!isNaN(nombre) && isUnitéQuantité(unité)) {
				return quantité(nombre, unité)
			}
		}

		const nombre = parseFloat(valeur)
		if (!isNaN(nombre) && valeur.trim() === nombre.toString()) {
			return nombre
		}

		const doubleSingleQuoteMatch = valeur.match(/^''([^']*)''$/)
		if (doubleSingleQuoteMatch) {
			return doubleSingleQuoteMatch[1]
		}

		const singleQuoteMatch = valeur.match(/^'([^']*)'$/)
		if (singleQuoteMatch) {
			return singleQuoteMatch[1]
		}

		return valeur
	},
}
