import React, { createContext, useContext, useState } from 'react'

import { initialRésultat, Résultat } from '../domaine/résultat'
import { initialSituationCMG, SituationCMG } from '../domaine/situation'

type SituationContextType = {
	situation: SituationCMG
	updateSituation: (updater: (prev: SituationCMG) => SituationCMG) => void
	résultat: Résultat
	updateRésultat: (updater: (prev: Résultat) => Résultat) => void
}

const SituationContext = createContext<SituationContextType | null>(null)

export const CMGProvider: React.FC<{
	children: React.ReactNode
}> = ({ children }) => {
	const [situation, setSituation] = useState<SituationCMG>(initialSituationCMG)
	const [résultat, setRésultat] = useState<Résultat>(initialRésultat)

	const updateSituation = (updater: (prev: SituationCMG) => SituationCMG) => {
		setSituation(updater)
	}

	const updateRésultat = (updater: (prev: Résultat) => Résultat) => {
		setRésultat(updater)
	}

	return (
		<SituationContext.Provider
			value={{
				situation,
				updateSituation,
				résultat,
				updateRésultat,
			}}
		>
			{children}
		</SituationContext.Provider>
	)
}

export const useSituationContext = () => {
	const context = useContext(SituationContext)
	if (!context) {
		throw new Error('useSituationContext doit être utilisé dans un CMGProvider')
	}

	return context
}
