import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'

export const useAxeCoreAnalysis = () => {
	// useEffect déclenché à chaque re-render du composant ou des enfants du composant
	// où il est placé
	useEffect(() => {
		if (import.meta.env.PROD || !import.meta.env.VITE_AXE_CORE_ENABLED) return

		const triggerAxeCoreAnalysis = async () => {
			// On importe axe-core/react uniquement si nécessaire
			const axe = await import('@axe-core/react')

			await axe.default(React, ReactDOM, 1000)
		}

		void triggerAxeCoreAnalysis()
	})
}
