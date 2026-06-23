import { EnvironnementDéployé } from '@/domaine/EnvironnementDeploye'

export type VariablesTracking = {
	plausibleDomaine?: string
	plausibleHôteApi?: string
	plausibleSuivreLocalhost: boolean
	pianoSiteId?: string
}

export type ParamètresTracking = {
	plausible: {
		domaine: string
		hôteApi: string
		suivreLocalhost: boolean
	}
	piano: {
		siteId?: string
	}
}

export function paramètresTracking(
	variables: VariablesTracking,
	environnement: EnvironnementDéployé
): ParamètresTracking {
	return {
		plausible: {
			domaine:
				variables.plausibleDomaine ||
				(environnement === 'production'
					? 'mon-entreprise.urssaf.fr'
					: 'dev.mon-entreprise.fr'),
			hôteApi: variables.plausibleHôteApi || 'https://plausible.io',
			suivreLocalhost: variables.plausibleSuivreLocalhost,
		},
		piano: {
			siteId: variables.pianoSiteId,
		},
	}
}
