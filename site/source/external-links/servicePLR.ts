import { URSSAF } from '@/utils/logos'

// TODO: gérer les traductions
export const servicePLR = {
	associatedRule: {
		'toutes ces conditions': [
			'dirigeant . indépendant . PL',
			'entreprise . activité . nature . libérale . réglementée',
			"dirigeant . indépendant . PL . métier != 'expert-comptable'",
			'dirigeant . indépendant . PL . PAMC = non',
		],
	},
	url: 'https://www.urssaf.fr/accueil/services/services-independants/service-plr.html',
	title: 'Le service en ligne Profession libérale réglementée',
	description:
		'L’Urssaf met à votre disposition un service en ligne. Il vous permet de gérer votre activité, contacter un conseiller et retrouver tous vos documents.',
	ctaLabel: 'Accéder au service',
	ariaLabel: 'Accéder au service sur urssaf.fr, nouvelle fenêtre',
	logo: URSSAF,
}
