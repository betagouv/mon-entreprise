import React, { createContext, useContext, useState } from 'react'

import { Comparateur } from '@/domaine/comparateur/ComparateurDeModèle'

type ComparateurContextType = {
	comparateur: Comparateur
	updateComparateur: (updater: (prev: Comparateur) => Comparateur) => void
}

const ComparateurContext = createContext<ComparateurContextType | null>(null)

export const ComparateurProvider: React.FC<{
	children: React.ReactNode
	comparateurInitial: Comparateur
}> = ({ children, comparateurInitial }) => {
	const [comparateur, setComparateur] = useState(comparateurInitial)
	const updateComparateur = (updater: (prev: Comparateur) => Comparateur) => {
		setComparateur(updater)
	}

	return (
		<ComparateurContext.Provider
			value={{
				comparateur,
				updateComparateur,
			}}
		>
			{children}
		</ComparateurContext.Provider>
	)
}

export const useComparateur = () => {
	const comparateur = useContext(ComparateurContext)

	if (!comparateur) {
		throw new Error(
			'useComparateur doit être utilisé dans un ComparateurProvider'
		)
	}

	return comparateur
}
