import { number, int } from './validators'

let pourcentage = {
	human: () => null,
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
	human: () => null,
	validator: int
}

let euros = {
	human: () => null,
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
