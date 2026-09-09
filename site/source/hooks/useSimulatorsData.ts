import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import getMetadataSrc, {
	SimulatorData,
} from '@/pages/simulateurs-et-assistants/metadata-src'
import { useSitePaths } from '@/sitePaths'

/**
 * Gets all simulator data
 */
export default function useSimulatorsData(): SimulatorData {
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
