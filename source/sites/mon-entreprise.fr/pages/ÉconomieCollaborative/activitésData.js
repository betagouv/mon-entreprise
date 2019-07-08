import { map, pipe, unnest } from 'ramda'
import activités from './activités.yaml'

export { activités }
export const flatActivités = pipe(
	map(a => (a.activités ? [a, ...a.activités] : [a])),
	unnest
)(activités)

export const getActivité = a => flatActivités.find(item => item.titre === a)

export const getMinimumDéclaration = a => {
	const activité = getActivité(a)
	if (activité.activités) {
		return null
	}
	if (activité['seuil pro'] === 0) {
		return 'PRO'
	}
	if (activité['seuil déclaration']) {
		return 'AUCUN'
	}
	if (activité['seuil pro']) {
		return 'IMPOSITION'
	}
	return 'AUCUN'
}
export const hasConditions = a => {
	const activité = getActivité(a)
	return !!(
		(activité['seuil pro'] && activité['seuil pro'] !== 0) ||
		activité['seuil déclaration'] ||
		activité['seuil pro'] ||
		activité.activités
	)
}

export const getSousActivités = activité =>
	(getActivité(activité).activités || []).map(({ titre }) => titre)
