import * as Sentry from '@sentry/react'
import { ComponentType, lazy, Suspense } from 'react'

import Loader from '@/components/utils/Loader'
import { MDXWrapper } from '@/design-system'
import { AvailableLang } from '@/locales/langue'
import { applicationLanguage } from '@/services/applicationLanguage'

const FALLBACK_LANG: AvailableLang = 'fr'

type ModuleMDX = { default: ComponentType }

export const documentationMDX = (
	importer: (langue: AvailableLang) => Promise<unknown>
): ComponentType => {
	const Content = lazy(async () => {
		const langue = applicationLanguage()

		try {
			return (await importer(langue)) as ModuleMDX
		} catch (error) {
			if (langue === FALLBACK_LANG) {
				throw error
			}

			Sentry.captureException(error)

			return (await importer(FALLBACK_LANG)) as ModuleMDX
		}
	})

	const DocumentationMDX = () => (
		<Suspense fallback={<Loader />}>
			<MDXWrapper>
				<Content />
			</MDXWrapper>
		</Suspense>
	)

	return DocumentationMDX
}
