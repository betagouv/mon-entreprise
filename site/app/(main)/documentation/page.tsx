import type { Metadata } from 'next'

// Import direct de la frontière client : l'index du module agrège aussi des
// composants que Next ne peut pas charger depuis un Server Component.
import { AccueilDeLaDocumentation } from '@/components/documentation/AccueilDeLaDocumentation'
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
