import React, { createContext, useContext, useState } from 'react'

import {
	initialSituationÉconomieCollaborative,
	SituationÉconomieCollaborative,
} from '../domaine/location-de-meublé/situation'

type SituationContextType = {
	situation: SituationÉconomieCollaborative
	updateSituation: (
		updater: (
			prev: SituationÉconomieCollaborative
		) => SituationÉconomieCollaborative
	) => void
}

const SituationContext = createContext<SituationContextType | null>(null)

export const ÉconomieCollaborativeProvider: React.FC<{
	children: React.ReactNode
}> = ({ children }) => {
	const [situation, setSituation] = useState<SituationÉconomieCollaborative>(
		initialSituationÉconomieCollaborative
	)

	const updateSituation = (
		updater: (
			prev: SituationÉconomieCollaborative
		) => SituationÉconomieCollaborative
	) => {
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
		throw new Error(
			'useSituationContext doit être utilisé dans un ÉconomieCollaborativeProvider'
		)
	}

	return context
}
