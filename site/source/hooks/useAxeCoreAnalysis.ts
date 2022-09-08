import { useEffect, useRef } from 'react'

export const useAxeCoreAnalysis = () => {
	// On stocke les packages importés dans des refs lors du premier import
	// pour économiser les ressources
	const axeRef = useRef<{
		default: (_React: any, _ReactDOM: any, _timeout: number) => Promise<void>
	}>()
	const ReactRef = useRef<any>()
	const ReactDOMRef = useRef<any>()

	// useEffect déclenché à chaque re-render du composant ou des enfants du composant
	// où il est placé
	useEffect(() => {
		// Ne se lance qu'en mode "development"
		if (process.env.NODE_ENV === 'production') return

		const triggerAxeCoreAnalysis = async () => {
			// On importe les packages requis uniquement si nécessaire
			if (!axeRef.current && !ReactRef.current && !ReactDOMRef.current) {
				axeRef.current = await import('@axe-core/react')
				ReactRef.current = await import('react')
				ReactDOMRef.current = await import('react-dom')
			}

			await axeRef?.current?.default(
				ReactRef.current,
				ReactDOMRef.current,
				1000
			)
		}

		void triggerAxeCoreAnalysis()
	})
}
