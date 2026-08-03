import React, {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
} from 'react'

import { ModèleComparable } from '../domaine/modeleComparable'
import {
	initialSituationComparée,
	SituationComparée,
} from '../domaine/situation'

type SituationContextType = {
	modèles: ModèleComparable[]
	situation: SituationComparée
	updateSituation: (
		updater: (prev: SituationComparée) => SituationComparée
	) => void
}

const SituationContext = createContext<SituationContextType | null>(null)

export const ComparateurProvider: React.FC<{
	modèles: ModèleComparable[]
	children: React.ReactNode
}> = ({ modèles, children }) => {
	// TODO: ajouter la gestion du lien de partage

	const [situation, setSituation] = useState<SituationComparée>(
		initialSituationComparée
	)

	const updateSituation = useCallback(
		(updater: (prev: SituationComparée) => SituationComparée) =>
			setSituation(updater),
		[]
	)

	const value = useMemo(
		() => ({ modèles, situation, updateSituation }),
		[modèles, situation, updateSituation]
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
			'useSituationContext doit être utilisé dans un ComparateurProvider'
		)
	}

	return context
}
