import React, { useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'

export const useAxeCoreAnalysis = () => {
	const axeRef = useRef<
		| {
				default: (
					_React: unknown,
					_ReactDOM: unknown,
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
