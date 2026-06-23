import { EnvironnementDéployé } from '@/domaine/EnvironnementDeploye'

import { paramètresTracking } from './parametresTracking'

const sousVite = typeof import.meta.env !== 'undefined'

const environnementDéployé: EnvironnementDéployé = sousVite
	? ENVIRONNEMENT
	: (process.env.NEXT_PUBLIC_ENVIRONNEMENT as
			| EnvironnementDéployé
			| undefined) ?? 'développement'

export const trackingConfig = paramètresTracking(
	{
		plausibleDomaine: sousVite
			? import.meta.env.VITE_PLAUSIBLE_DOMAIN
			: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN,
		plausibleHôteApi: sousVite
			? import.meta.env.VITE_PLAUSIBLE_API_HOST
			: process.env.NEXT_PUBLIC_PLAUSIBLE_API_HOST,
		plausibleSuivreLocalhost: sousVite
			? import.meta.env.VITE_PLAUSIBLE_TRACK_LOCALHOST === 'true'
			: process.env.NEXT_PUBLIC_PLAUSIBLE_TRACK_LOCALHOST === 'true',
		pianoSiteId: sousVite
			? import.meta.env.VITE_AT_INTERNET_SITE_ID
			: process.env.NEXT_PUBLIC_AT_INTERNET_SITE_ID,
	},
	environnementDéployé
)
