import type { Metadata } from 'next'

import i18next, { langue } from '@/locales/i18n-server'
import { environnement } from '@/services/environnement/environnement'
import { Salarié } from '@/simulateurs/salarié'
import { salariéMetadata } from '@/simulateurs/salarié/metadata'
import { salariéOpenGraph } from '@/simulateurs/salarié/opengraph'
import { absoluteSitePaths } from '@/sitePaths'

const métadonnées = salariéMetadata({
	t: i18next.t,
	sitePaths: absoluteSitePaths[langue],
	language: langue,
})

const openGraph = salariéOpenGraph(i18next.t, langue)

const urlDuSite = environnement.urls[langue]

export const metadata: Metadata = {
	title: métadonnées.meta.title,
	description: métadonnées.meta.description,
	openGraph: {
		title: openGraph.title,
		description: openGraph.description,
		// Une image Open Graph n'est exploitable qu'en URL absolue. Sans URL de
		// site configurée, on l'omet plutôt que de faire échouer le build.
		...(urlDuSite && openGraph.image
			? { images: new URL(openGraph.image, urlDuSite).toString() }
			: {}),
	},
}

export default function Page() {
	return <Salarié />
}
