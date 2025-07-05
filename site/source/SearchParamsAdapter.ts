import {
	euros,
	eurosParAn,
	eurosParHeure,
	eurosParJour,
	eurosParMois,
	isMontant,
	Montant,
} from '@/domaine/Montant'
import { isQuantité, Quantité, quantité } from '@/domaine/Quantité'

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
		const montantRegex = /^([0-9]+(?:[.,][0-9]+)?)\s*(€(?:\/[a-z]+)?)$/
		const montantMatch = valeur.match(montantRegex)
		if (montantMatch) {
			const [, numberStr, unit] = montantMatch
			const nombre = parseFloat(numberStr.replace(',', '.'))

			if (!isNaN(nombre)) {
				switch (unit) {
					case '€':
						return euros(nombre)
					case '€/mois':
						return eurosParMois(nombre)
					case '€/an':
						return eurosParAn(nombre)
					case '€/jour':
						return eurosParJour(nombre)
					case '€/heure':
						return eurosParHeure(nombre)
				}
			}
		}

		const quantitéRegex =
			/^([0-9]+(?:[.,][0-9]+)?)\s*([a-zA-Z]+(?:\/[a-zA-Z]+)?)$/
		const quantitéMatch = valeur.match(quantitéRegex)
		if (quantitéMatch) {
			const [, numberStr, unit] = quantitéMatch
			const nombre = parseFloat(numberStr.replace(',', '.'))

			const isValidUnit =
				unit.includes('/') ||
				['heures', 'jours', 'mois', 'ans', 'semaines', 'trimestres'].includes(
					unit
				)

			if (!isNaN(nombre) && !unit.includes('€') && isValidUnit) {
				return quantité(nombre, unit)
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
