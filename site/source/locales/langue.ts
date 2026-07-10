export const SUPPORTED_LANGUAGES = ['fr', 'en'] as const
export type AvailableLang = (typeof SUPPORTED_LANGUAGES)[number]

export const LOCALE_PAR_LANGUE: Record<AvailableLang, string> = {
	fr: 'fr-FR',
	en: 'en-GB',
}

export const estLangueSupportée = (valeur: string): valeur is AvailableLang =>
	(SUPPORTED_LANGUAGES as readonly string[]).includes(valeur)

export const parseLangue = (raw: string | undefined): AvailableLang => {
	const value = raw ?? 'fr'
	if (!estLangueSupportée(value)) {
		throw new Error(
			`LANGUE invalide : "${value}". Valeurs supportées : ${SUPPORTED_LANGUAGES.join(
				', '
			)}.`
		)
	}

	return value
}
