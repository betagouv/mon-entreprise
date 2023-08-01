import React, { useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'

export const useAxeCoreAnalysis = () => {
	const axeRef = useRef<
		| {
				default: (
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					_React: any,
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					_ReactDOM: any,
					_timeout: number
				) => Promise<void>
		  }
		| undefined
	>()

	const triggerAxeCoreAnalysis = async () => {
		await axeRef.current?.default(React, ReactDOM, 1000)
	}

	// On importe axe-core/react uniquement si ce n'est pas déjà fait
	if (!axeRef.current) {
		import('@axe-core/react')
			.then(async (axe) => {
				axeRef.current = axe
				await triggerAxeCoreAnalysis()
			})
			.catch((err) => {
				// eslint-disable-next-line no-console
				console.error(err)
			})
	}

	// useEffect déclenché à chaque re-render du composant ou des enfants du composant
	// où il est placé
	useEffect(() => {
		if (!axeRef.current) return

		void triggerAxeCoreAnalysis()
	})
}
