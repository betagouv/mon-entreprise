import React, {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
} from 'react'

import {
	initialSituationFrontalierSuisse,
	SituationFrontalierSuisse,
} from '../domaine/situation'

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
	const [situation, setSituation] = useState<SituationFrontalierSuisse>(
		initialSituationFrontalierSuisse
	)

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
