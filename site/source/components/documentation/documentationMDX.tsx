import { ComponentType, lazy, Suspense } from 'react'

import Loader from '@/components/utils/Loader'
import { MDXWrapper } from '@/design-system'
import i18n from '@/locales/i18n'
import { AvailableLang, parseLangue } from '@/locales/langue'

type ModuleMDX = { default: ComponentType }

export const documentationMDX = (
	importer: (langue: AvailableLang) => Promise<unknown>
): ComponentType => {
	const Content = lazy(
		() => importer(parseLangue(i18n.language)) as Promise<ModuleMDX>
	)

	const DocumentationMDX = () => (
		<Suspense fallback={<Loader />}>
			<MDXWrapper>
				<Content />
			</MDXWrapper>
		</Suspense>
	)

	return DocumentationMDX
}
