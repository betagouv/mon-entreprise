import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import {
	PageMetadata,
	SimulatorsDataParams,
} from '@/pages/simulateurs/_configs/types'
import { useSitePaths } from '@/sitePaths'
import { ImmutableType } from '@/types/utils'

export function usePageMetadata<M extends ImmutableType<PageMetadata>>(
	pageMetadata: (params: SimulatorsDataParams) => M
): M {
	const [t, i18n] = useTranslation()
	const { absoluteSitePaths } = useSitePaths()

	return useMemo(
		() =>
			pageMetadata({
				t,
				sitePaths: absoluteSitePaths,
				language: i18n.language,
			}),
		[pageMetadata, t, absoluteSitePaths, i18n.language]
	)
}
