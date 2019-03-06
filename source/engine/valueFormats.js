import { number, int } from './validators'
import { memoizeWith } from 'ramda'

const NumberFormat = memoizeWith(JSON.stringify, Intl.NumberFormat)

let numberFormatter = style => (value, language) =>
	NumberFormat(language, {
		style,
		currency: 'EUR',
		maximumFractionDigits: 2,
		minimumFractionDigits: 2
	}).format(value)

let pourcentage = {
	human: numberFormatter('decimal'),
	validator: number
}

let mois = {
	human: value => value + ' ' + 'mois',
	validator: int
}

let jours = {
	human: value => value + ' ' + 'jours',
	validator: int
}

let nombre = {
	human: numberFormatter('decimal'),
	validator: int
}

let euros = {
	human: numberFormatter('currency'),
	validator: number
}

let booleanTranslations = {
	fr: { true: 'Oui', false: 'Non' },
	en: { true: 'Yes', false: 'No' }
}

let booléen = {
	human: (value, language = 'fr') => booleanTranslations[language][value]
}

let texte = {
	human: value => value,
	validator: { test: () => true }
}

let objet = {
	human: value => JSON.stringify(value)
}

export default {
	pourcentage,
	euros,
	mois,
	jours,
	nombre,
	texte,
	booléen,
	objet
}
