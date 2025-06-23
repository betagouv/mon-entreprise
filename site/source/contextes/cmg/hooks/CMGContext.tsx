import React, { createContext, useContext, useState } from 'react'

import { initialRésultat, Résultat } from '../domaine/résultat'
import { initialSituationCMG, SituationCMG } from '../domaine/situation'

type SituationContextType = {
	situation: SituationCMG
	updateSituation: (updater: (prev: SituationCMG) => SituationCMG) => void
	moisIdentiques: MoisIdentiques
	updateMoisIdentiques: (
		updater: (prev: MoisIdentiques) => MoisIdentiques
	) => void
	resetMoisIdentiques: () => void
	résultat: Résultat
	updateRésultat: (updater: (prev: Résultat) => Résultat) => void
}

export type MoisIdentiques = {
	GED: Array<boolean>
	AMA: Array<boolean>
}

const SituationContext = createContext<SituationContextType | null>(null)

const MoisIdentiquesParDéfaut: MoisIdentiques = { GED: [], AMA: [] }

export const CMGProvider: React.FC<{
	children: React.ReactNode
}> = ({ children }) => {
	const [situation, setSituation] = useState<SituationCMG>(initialSituationCMG)
	const [moisIdentiques, setMoisIdentiques] = useState<MoisIdentiques>(
		MoisIdentiquesParDéfaut
	)
	const [résultat, setRésultat] = useState<Résultat>(initialRésultat)

	const updateSituation = (updater: (prev: SituationCMG) => SituationCMG) => {
		setSituation(updater)
	}

	const updateMoisIdentiques = (
		updater: (prev: MoisIdentiques) => MoisIdentiques
	) => {
		setMoisIdentiques(updater)
	}

	const updateRésultat = (updater: (prev: Résultat) => Résultat) => {
		setRésultat(updater)
	}

	const resetMoisIdentiques = () => setMoisIdentiques(MoisIdentiquesParDéfaut)

	return (
		<SituationContext.Provider
			value={{
				situation,
				updateSituation,
				moisIdentiques,
				resetMoisIdentiques,
				updateMoisIdentiques,
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
