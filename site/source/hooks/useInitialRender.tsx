import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react'

const InitialRenderContext = createContext<boolean | null>(null)

export function WatchInitialRender(props: { children: ReactNode }) {
	const [initialRender, setInitialRender] = useState(true)
	useEffect(() => {
		setInitialRender(false)
	}, [])

	return (
		<InitialRenderContext.Provider value={initialRender}>
			{props.children}
		</InitialRenderContext.Provider>
	)
}

export function useInitialRender(): boolean {
	const initialRenderFromContext = useContext(InitialRenderContext)
	const unChangedInitialRender = useMemo(() => initialRenderFromContext, [])

	const [initialRender, setInitialRender] = useState(true)
	useEffect(() => {
		setInitialRender(false)
	}, [])

	if (unChangedInitialRender !== null) {
		return unChangedInitialRender
	}

	return initialRender
}
