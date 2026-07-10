import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react'

import { PARAMÈTRE_SITUATION } from '@/domaine/parametre-situation'
import { useNavigation } from '@/lib/navigation'

import {
	initialSituationFrontalierSuisse,
	situationEstCommencée,
	SituationFrontalierSuisse,
} from '../domaine/situation'
import {
	decodeSituation,
	encodeSituation,
} from '../domaine/situation-query-string'

type SituationContextType = {
	situation: SituationFrontalierSuisse
	updateSituation: (
		updater: (prev: SituationFrontalierSuisse) => SituationFrontalierSuisse
	) => void
}

const SituationContext = createContext<SituationContextType | null>(null)

export const FrontalierSuisseProvider: React.FC<{
	children: React.ReactNode
}> = ({ children }) => {
	const { searchParams, setSearchParams } = useNavigation()

	const [situation, setSituation] = useState<SituationFrontalierSuisse>(() => {
		const encodée = searchParams.get(PARAMÈTRE_SITUATION)

		return encodée ? decodeSituation(encodée) : initialSituationFrontalierSuisse
	})

	useEffect(() => {
		const encodée = situationEstCommencée(situation)
			? encodeSituation(situation)
			: null
		if (searchParams.get(PARAMÈTRE_SITUATION) === encodée) {
			return
		}
		setSearchParams(
			(précédents) => {
				const suivants = new URLSearchParams(précédents)
				if (encodée === null) {
					suivants.delete(PARAMÈTRE_SITUATION)
				} else {
					suivants.set(PARAMÈTRE_SITUATION, encodée)
				}

				return suivants
			},
			{ replace: true }
		)
	}, [situation, searchParams, setSearchParams])

	const updateSituation = useCallback(
		(updater: (prev: SituationFrontalierSuisse) => SituationFrontalierSuisse) =>
			setSituation(updater),
		[]
	)

	const value = useMemo(
		() => ({ situation, updateSituation }),
		[situation, updateSituation]
	)

	return (
		<SituationContext.Provider value={value}>
			{children}
		</SituationContext.Provider>
	)
}

export const useSituationContext = () => {
	const context = useContext(SituationContext)
	if (!context) {
		throw new Error(
			'useSituationContext doit être utilisé dans un FrontalierSuisseProvider'
		)
	}

	return context
}
