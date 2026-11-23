import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { useSitePaths } from '@/hooks/useSitePaths'
import getMetadataSrc, {
	SimulatorMetadata,
	SimulatorsMetadata,
} from '@/pages/simulateurs-et-assistants/metadata-src'
import { Merge, ToOptional } from '@/types/utils'

export type SimulateurId = keyof SimulatorsMetadata

export type MergedSimulatorMetadata = ToOptional<Merge<SimulatorMetadata>>

export function useSimulatorsMetadata(): SimulatorsMetadata {
	const [t, i18n] = useTranslation()
	const { absoluteSitePaths } = useSitePaths()

	return useMemo(
		() =>
			getMetadataSrc({
				t,
				sitePaths: absoluteSitePaths,
				language: i18n.language,
			}),
		[t, absoluteSitePaths, i18n.language]
	)
}
