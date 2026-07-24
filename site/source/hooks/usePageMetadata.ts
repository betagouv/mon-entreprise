import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import {
	PageMetadata,
	PageMetadataParams,
} from '@/pages/simulateurs/_configs/types'
import { useSitePaths } from '@/sitePaths'
import { ImmutableType } from '@/types/utils'

import { MergedSimulatorMetadata } from './useSimulatorsMetadata'

export function usePageMetadata(
	pageMetadata: (params: PageMetadataParams) => ImmutableType<PageMetadata>
): MergedSimulatorMetadata {
	const [t, i18n] = useTranslation()
	const { absoluteSitePaths } = useSitePaths()

	return useMemo(
		() =>
			pageMetadata({
				t,
				sitePaths: absoluteSitePaths,
				language: i18n.language,
			}) as MergedSimulatorMetadata,
		[pageMetadata, t, absoluteSitePaths, i18n.language]
	)
}
