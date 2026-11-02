import type { Metadata } from 'next'

import i18next from '@/locales/i18n-server'

export const métadonnéesDeRègle: Metadata = {
	title: i18next.t('pages.documentation.meta.title', 'Documentation'),
	description: i18next.t(
		'pages.documentation.meta.description',
		'Documentation des règles de calcul de nos simulateurs et assistants'
	),
}
