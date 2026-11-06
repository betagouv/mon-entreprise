import type { Metadata } from 'next'

import { AccueilDeLaDocumentation } from '@/components/documentation'
import i18next from '@/locales/i18n-server'

export const metadata: Metadata = {
	title: i18next.t('pages.documentation.meta.title', 'Documentation'),
	description: i18next.t(
		'pages.documentation.meta.descriptionBis',
		'Explorez toutes les règles de la documentation'
	),
}

export default function Page() {
	return <AccueilDeLaDocumentation />
}
