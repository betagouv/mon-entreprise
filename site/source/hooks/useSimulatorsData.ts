import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import getConfigsSrc, {
	SimulatorData,
} from '@/pages/simulateurs-et-assistants/configs-src'
import { useSitePaths } from '@/sitePaths'

/**
 * Gets all simulator data
 */
export default function useSimulatorsData(): SimulatorData {
	const [t, i18n] = useTranslation()
	const { absoluteSitePaths } = useSitePaths()

	return useMemo(
		() =>
			getConfigsSrc({
				t,
				sitePaths: absoluteSitePaths,
				language: i18n.language,
			}),
		[t, absoluteSitePaths, i18n.language]
	)
}

export type SimulateurId = keyof ReturnType<typeof useSimulatorsData>
