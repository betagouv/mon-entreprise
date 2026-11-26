import { estLangueSupportée, type AvailableLang } from '@/locales/langue'
import { environnement } from '@/services/environnement'

const DEFAULT_LANGUAGE: AvailableLang = 'fr'

const buildLanguage = (): AvailableLang | undefined => {
	const declaredAtBuild = environnement.sousVite
		? undefined
		: process.env.LANGUE

	return declaredAtBuild && estLangueSupportée(declaredAtBuild)
		? declaredAtBuild
		: undefined
}

let language = buildLanguage()
let alreadyWarned = false

export const declareLanguage = (newLanguage: AvailableLang): void => {
	language = newLanguage
}

export const applicationLanguage = (): AvailableLang => {
	if (language) {
		return language
	}

	if (!alreadyWarned) {
		alreadyWarned = true
		// eslint-disable-next-line no-console
		console.warn('Langue demandée avant d’être déclarée')
	}

	return DEFAULT_LANGUAGE
}
