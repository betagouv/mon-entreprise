import { map, pipe, unnest } from 'ramda'
import activitésEn from './activités.en.yaml'
import activités from './activités.yaml'

export { activités }
export const flatActivités = pipe(
	map((a: any) => (a.activités ? [a, ...a.activités] : [a])),
	unnest
)(activités)

export const getActivité = (a: string) =>
	flatActivités.find(item => item.titre === a)

export const getTranslatedActivité = (title: string, language: string) => ({
	...getActivité(title),
	...(language !== 'fr' && activitésEn[title])
})

export const getMinimumDéclaration = (a: string) => {
	const activité = getActivité(a)
	if (activité['seuil pro'] === 0 && !activité['seuil régime général']) {
		return 'RÉGIME_GÉNÉRAL_NON_DISPONIBLE'
	}
	if (activité['seuil pro'] === 0) {
		return 'RÉGIME_GÉNÉRAL_DISPONIBLE'
	}
	if (activité['seuil déclaration'] === 0) {
		return 'IMPOSITION'
	}
	if (activité['seuil déclaration']) {
		return 'AUCUN'
	}
	return null
}
export const hasConditions = (a: string) => {
	const activité = getActivité(a)
	return !!(
		activité['exonérée sauf si'] ||
		(activité['seuil pro'] && activité['seuil pro'] !== 0) ||
		activité['seuil déclaration'] ||
		activité['seuil pro'] ||
		activité.activités
	)
}

export const getSousActivités = (a: string) =>
	(getActivité(a).activités || []).map(({ titre }: { titre: string }) => titre)
