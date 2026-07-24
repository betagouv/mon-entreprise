import { PageMetadataParams } from '../_configs/types'

export function activitéPartielleMetadata({
	t,
	sitePaths,
}: PageMetadataParams) {
	return {
		id: 'activité-partielle',
		pathId: 'simulateurs.activité-partielle',
		path: sitePaths.simulateurs['activité-partielle'],
		iframePath: 'simulateur-chomage-partiel',
		icône: '📉',
		tracking: {
			chapter1: 'simulateurs',
			chapter2: 'chomage_partiel',
		},
		title: t(
			'pages.simulateurs.activité-partielle.title',
			"Simulateur du calcul de l'indemnité activité partielle"
		),
		shortName: t(
			'pages.simulateurs.activité-partielle.shortname',
			'Activité partielle'
		),
		meta: {
			title: t(
				'pages.simulateurs.activité-partielle.meta.titre',
				"Calcul de l'indemnité activité partielle : le simulateur Urssaf"
			),
			description: t(
				'pages.simulateurs.activité-partielle.meta.description',
				"Calcul du revenu net pour l'employé et du reste à charge pour l'employeur après remboursement de l'Etat, en prenant en compte toutes les cotisations sociales."
			),
		},
	} as const
}
