import React, { createContext, useContext, useState } from 'react'

import { initialSituationCMG, SituationCMG } from '../domaine/situation'

type SituationContextType = {
	situation: SituationCMG
	updateSituation: (updater: (prev: SituationCMG) => SituationCMG) => void
}

const SituationContext = createContext<SituationContextType | null>(null)

export const CMGProvider: React.FC<{
	children: React.ReactNode
}> = ({ children }) => {
	const [situation, setSituation] = useState<SituationCMG>(initialSituationCMG)

	const updateSituation = (updater: (prev: SituationCMG) => SituationCMG) => {
		setSituation(updater)
	}

	return (
		<SituationContext.Provider
			value={{
				situation,
				updateSituation,
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
