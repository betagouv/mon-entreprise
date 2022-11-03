import { getValueFrom } from '@/utils'

import activitésEn from './activités.en.yaml'
import activités from './activités.yaml'

export { activités }

export type Activitée = typeof activités[number]
type ActivitésEn = typeof activitésEn

export const flatActivités = activités.flatMap((el) => [
	el,
	...(getValueFrom(el, 'activités') || []),
])

export const getActivité = (a: string) =>
	flatActivités.find((item) => item.titre === a) ??
	({} as Record<string, never>)

export const getTranslatedActivité = (title: string, language: string) => {
	return {
		...getActivité(title),
		...(language !== 'fr' &&
			getValueFrom(activitésEn, title as keyof ActivitésEn)),
	} as ReturnType<typeof getActivité>
}

export const getMinimumDéclaration = (a: string) => {
	const activité = getActivité(a)
	if (
		getValueFrom(activité, 'seuil pro') === 0 &&
		!getValueFrom(activité, 'seuil régime général')
	) {
		return 'RÉGIME_GÉNÉRAL_NON_DISPONIBLE'
	}
	if (getValueFrom(activité, 'seuil pro') === 0) {
		return 'RÉGIME_GÉNÉRAL_DISPONIBLE'
	}
	if (getValueFrom(activité, 'seuil déclaration') === 0) {
		return 'IMPOSITION'
	}
	if (getValueFrom(activité, 'seuil déclaration')) {
		return 'AUCUN'
	}

	return null
}
export const hasConditions = (a: string) => {
	const activité = getActivité(a)

	return !!(
		getValueFrom(activité, 'exonérée sauf si') ||
		getValueFrom(activité, 'seuil déclaration') ||
		getValueFrom(activité, 'exonérée si') ||
		getValueFrom(activité, 'seuil pro') ||
		getValueFrom(activité, 'activités')
	)
}

export const getSousActivités = (a: string) => {
	const activités = getValueFrom(getActivité(a), 'activités') || []

	return activités.map(({ titre }) => titre)
}
