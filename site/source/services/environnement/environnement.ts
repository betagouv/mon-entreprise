import { EnvironnementDéployé } from '@/domaine/EnvironnementDeploye'

import { paramètresTracking } from './parametresTracking'

const sousVite = typeof import.meta.env !== 'undefined'

const déployé: EnvironnementDéployé =
	typeof ENVIRONNEMENT !== 'undefined'
		? ENVIRONNEMENT
		: (process.env.NEXT_PUBLIC_ENVIRONNEMENT as
				| EnvironnementDéployé
				| undefined) ?? 'développement'

export const environnement = {
	déployé,
	branche:
		typeof BRANCH_NAME !== 'undefined'
			? BRANCH_NAME
			: process.env.NEXT_PUBLIC_BRANCH_NAME ?? '',
	sentryRelease:
		typeof SENTRY_RELEASE_NAME !== 'undefined'
			? SENTRY_RELEASE_NAME
			: process.env.NEXT_PUBLIC_SENTRY_RELEASE ?? '',
	algolia: {
		appId: sousVite
			? import.meta.env.VITE_ALGOLIA_APP_ID
			: process.env.NEXT_PUBLIC_ALGOLIA_APP_ID ?? '',
		searchKey: sousVite
			? import.meta.env.VITE_ALGOLIA_SEARCH_KEY
			: process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY ?? '',
		préfixeIndex: sousVite
			? import.meta.env.VITE_ALGOLIA_INDEX_PREFIX
			: process.env.NEXT_PUBLIC_ALGOLIA_INDEX_PREFIX ?? '',
	},
	urls: {
		fr: sousVite
			? import.meta.env.VITE_FR_BASE_URL
			: process.env.NEXT_PUBLIC_FR_BASE_URL ?? '',
		en: sousVite
			? import.meta.env.VITE_EN_BASE_URL
			: process.env.NEXT_PUBLIC_EN_BASE_URL ?? '',
	},
	features: {
		économieCollaborative: {
			afficherLesCotisations: sousVite
				? import.meta.env.VITE_ENABLE_ECONOMIE_COLLABORATIVE_COTISATIONS ===
				  'true'
				: process.env.NEXT_PUBLIC_ENABLE_ECONOMIE_COLLABORATIVE_COTISATIONS ===
				  'true',
		},
	},
	tracking: paramètresTracking(
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
		déployé
	),
}
