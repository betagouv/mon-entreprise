import { createContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { useSitePaths } from '@/sitePaths'

import getMetadataSrc from './metadata-src'

export type SimulatorData = ReturnType<typeof getMetadataSrc>

/**
 * Extract type if U extends T
 * Else return an object with value undefined
 */
type ExtractOrUndefined<T, U> = T extends U ? T : Record<keyof U, undefined>

/**
 * Extract type from a key of SimulatorData
 */
export type ExtractFromSimuData<T extends string> = ExtractOrUndefined<
	SimulatorData[keyof SimulatorData],
	Record<T, unknown>
>[T]

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

type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U

export const CurrentSimulatorDataContext = createContext<Overwrite<
	SimulatorData[keyof SimulatorData],
	{ path: ExtractFromSimuData<'path'> }
> | null>(null)

export const CurrentSimulatorDataProvider = CurrentSimulatorDataContext.Provider
