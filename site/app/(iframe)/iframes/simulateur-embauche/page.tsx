import type { Metadata } from 'next'

import { ChromeIframe } from '@/components/layout/ChromeIframe'
import i18next, { langue } from '@/locales/i18n-server'
import { Salarié } from '@/simulateurs/salarié'
import { salariéMetadata } from '@/simulateurs/salarié/metadata'
import { absoluteSitePaths } from '@/sitePaths'

const métadonnées = salariéMetadata({
	t: i18next.t,
	sitePaths: absoluteSitePaths[langue],
	language: langue,
})

export const metadata: Metadata = {
	title: métadonnées.meta.title,
	description: métadonnées.meta.description,
	alternates: { canonical: métadonnées.path },
}

export default function Page() {
	return (
		<ChromeIframe avecAvis>
			<Salarié />
		</ChromeIframe>
	)
}
