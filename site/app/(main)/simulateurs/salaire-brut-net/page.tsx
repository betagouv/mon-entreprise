import type { Metadata } from 'next'

import i18next, { langue } from '@/locales/i18n-server'
import { environnement } from '@/services/environnement'
import { Salarié } from '@/simulateurs/salarié'
import { salariéMetadata } from '@/simulateurs/salarié/metadata'
import { salariéOpenGraph } from '@/simulateurs/salarié/opengraph'
import { absoluteSitePaths } from '@/sitePaths'

const paths = {
	fr: '/simulateurs/salaire-brut-net',
	en: '/calculators/salary',
} as const

const métadonnées = salariéMetadata({
	t: i18next.t,
	sitePaths: absoluteSitePaths[langue],
	language: langue,
})

const openGraph = salariéOpenGraph(i18next.t, langue)

export const metadata: Metadata = {
	title: métadonnées.meta.title,
	description: métadonnées.meta.description,
	alternates: {
		canonical: paths[langue],
		languages: {
			fr: `${environnement.urls.fr}${paths.fr}`,
			en: `${environnement.urls.en}${paths.en}`,
		},
	},
	openGraph: {
		title: openGraph.title,
		description: openGraph.description,
		images: openGraph.image,
	},
}

export default function Page() {
	return <Salarié />
}
